package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.*;
import com.BusTracking.backend.Repository.*;
import com.BusTracking.backend.Service.EmailService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/stripe")
public class PaymentController {

    private final StudentRepo studentRepo;
    private final UserRepo userRepo;
    private final PaymentRepo paymentRepo;
    private final EmailService emailService;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public PaymentController(StudentRepo studentRepo,
                             UserRepo userRepo,
                             PaymentRepo paymentRepo,
                             EmailService emailService) {
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
        this.paymentRepo = paymentRepo;
        this.emailService = emailService;
    }


    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        System.out.println("🎯 Webhook Triggered!");

        try {
            Stripe.apiKey = stripeApiKey;

            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            System.out.println("📦 Stripe Event Type: " + event.getType() + " [ID: " + event.getId() + "]");

            // Parse the event data differently based on event type
            switch (event.getType()) {
                case "checkout.session.completed":
                    return handleCheckoutSessionCompleted(event);
                case "payment_intent.succeeded":
                    return handlePaymentIntentSucceeded(event);
                case "charge.succeeded":
                case "payment_intent.created":
                    return ResponseEntity.ok("Event acknowledged");
                default:
                    return ResponseEntity.ok("Unhandled event type");
            }
        } catch (Exception e) {
            System.out.println("❌ Webhook error: " + e.getMessage());
            return ResponseEntity.status(400).body("Webhook Error: " + e.getMessage());
        }
    }

    private ResponseEntity<String> handleCheckoutSessionCompleted(Event event) {
        try {
            // Alternative deserialization approach
            Session session = ApiResource.GSON.fromJson(
                    event.getDataObjectDeserializer().getRawJson(),
                    Session.class
            );

            if (session == null) {
                System.out.println("⚠ Could not parse session from event");
                return ResponseEntity.badRequest().body("Invalid session data");
            }

            System.out.println("🔄 Processing checkout session: " + session.getId());

            // Check if payment is completed
            if (!"paid".equals(session.getPaymentStatus())) {
                System.out.println("⏳ Payment not completed yet");
                return ResponseEntity.ok("Awaiting payment completion");
            }

            // Get customer email
            String email = session.getCustomerDetails() != null ?
                    session.getCustomerDetails().getEmail() :
                    session.getCustomerEmail();

            if (email == null) {
                System.out.println("⚠ No email found in session");
                return ResponseEntity.badRequest().body("Customer email not found");
            }

            return processSuccessfulPayment(
                    email,
                    BigDecimal.valueOf(session.getAmountTotal()).divide(BigDecimal.valueOf(100)),
                    session.getId()
            );
        } catch (Exception e) {
            System.out.println("❌ Error processing checkout session: " + e.getMessage());
            return ResponseEntity.status(500).body("Error processing checkout session");
        }
    }

    private ResponseEntity<String> handlePaymentIntentSucceeded(Event event) {
        try {
            // Alternative deserialization approach
            PaymentIntent paymentIntent = ApiResource.GSON.fromJson(
                    event.getDataObjectDeserializer().getRawJson(),
                    PaymentIntent.class
            );

            if (paymentIntent == null) {
                System.out.println("⚠ Could not parse payment intent from event");
                return ResponseEntity.badRequest().body("Invalid payment intent data");
            }

            System.out.println("💰 Processing payment intent: " + paymentIntent.getId());

            // Get the associated session
            String sessionId = paymentIntent.getMetadata().get("session_id");
            if (sessionId == null) {
                System.out.println("⚠ No session ID in metadata");
                return ResponseEntity.badRequest().body("No session ID found");
            }

            // Retrieve the session
            Session session = Session.retrieve(sessionId);
            String email = session.getCustomerDetails() != null ?
                    session.getCustomerDetails().getEmail() :
                    session.getCustomerEmail();

            if (email == null) {
                System.out.println("⚠ No email found in session");
                return ResponseEntity.badRequest().body("Customer email not found");
            }

            return processSuccessfulPayment(
                    email,
                    BigDecimal.valueOf(paymentIntent.getAmount()).divide(BigDecimal.valueOf(100)),
                    sessionId
            );
        } catch (StripeException e) {
            System.out.println("❌ Stripe error: " + e.getMessage());
            return ResponseEntity.status(500).body("Stripe API error");
        } catch (Exception e) {
            System.out.println("❌ Error processing payment intent: " + e.getMessage());
            return ResponseEntity.status(500).body("Error processing payment");
        }
    }

    private ResponseEntity<String> processSuccessfulPayment(String email, BigDecimal amount, String sessionId) {
        try {
            // Check for existing payment
            Optional<Payment> existingPayment = paymentRepo.findByStripeSessionId(sessionId);
            if (existingPayment.isPresent()) {
                System.out.println("🔄 Payment already processed");
                return ResponseEntity.ok("Payment already processed");
            }

            // Find student
            Optional<Student> optionalStudent = studentRepo.findByUserUsername(email);
            if (optionalStudent.isEmpty()) {
                System.out.println("❌ Student not found: " + email);
                return ResponseEntity.badRequest().body("Student not found");
            }

            // Create and save payment
            Payment payment = new Payment();
            payment.setStudentEmail(email);
            payment.setAmount(amount);
            payment.setMethod("STRIPE");
            payment.setStatus("PAID");
            payment.setPaymentDate(LocalDate.now());
            payment.setNextDueDate(LocalDate.now().plusMonths(1));
            payment.setVerificationToken(UUID.randomUUID().toString());
            payment.setStripeSessionId(sessionId);
            paymentRepo.save(payment);

            // Send verification email
            String verifyLink = "http://localhost:8080/api/stripe/verify-email?token=" + payment.getVerificationToken();
            emailService.sendVerificationEmail(email, verifyLink);

            System.out.println("✅ Payment processed successfully for: " + email);
            return ResponseEntity.ok("Payment processed successfully");
        } catch (Exception e) {
            System.out.println("❌ Error saving payment: " + e.getMessage());
            return ResponseEntity.status(500).body("Error saving payment");
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        System.out.println("🔐 Verifying token: " + token);

        Optional<Payment> optionalPayment = paymentRepo.findByVerificationToken(token);
        if (optionalPayment.isEmpty()) {
            System.out.println("❌ Invalid or expired token.");
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }

        Payment payment = optionalPayment.get();
        Optional<Student> optionalStudent = studentRepo.findByUserUsername(payment.getStudentEmail());

        if (optionalStudent.isEmpty()) {
            System.out.println("❌ Student not found for verification.");
            return ResponseEntity.badRequest().body("Student not found.");
        }

        User user = optionalStudent.get().getUser();
        user.setEmailVerified(true);
        userRepo.save(user);

        System.out.println("✅ Email verified for: " + user.getUsername());
        return ResponseEntity.ok("✅ Email verified successfully!");
    }



    @PostMapping("/upload-slip")
    public ResponseEntity<String> uploadPaymentSlip(
            @RequestParam("file") MultipartFile file,
            @RequestParam("studentId") Long studentId,
            @RequestParam("amount") String amount
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded");
            }

            Optional<Student> optionalStudent = studentRepo.findById(studentId);
            if (optionalStudent.isEmpty()) {
                return ResponseEntity.badRequest().body("Student not found");
            }
            Student student = optionalStudent.get();

            Payment payment = new Payment();
            payment.setStudentEmail(student.getUser().getUsername()); // ✅ Use actual email
            payment.setAmount(BigDecimal.valueOf(Double.parseDouble(amount)));
            payment.setMethod("BANK_SLIP");
            payment.setStatus("PENDING_APPROVAL");
            payment.setPaymentDate(LocalDate.now());
            payment.setNextDueDate(LocalDate.now().plusMonths(1));
            payment.setVerificationToken(UUID.randomUUID().toString());

            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            payment.setSlipImage(base64Image); // ✅ Make sure this field exists in the model

            paymentRepo.save(payment);

            return ResponseEntity.ok("Slip uploaded successfully. Awaiting admin approval.");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error processing file: " + e.getMessage());
        }
    }


    @GetMapping("/getAllPayments")
    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    @PutMapping("/approve-slip/{paymentId}")
    public ResponseEntity<String> approveSlip(@PathVariable Long paymentId) {
        Optional<Payment> optionalPayment = paymentRepo.findById(paymentId);

        if (optionalPayment.isEmpty()) {
            return ResponseEntity.badRequest().body("Payment not found");
        }

        Payment payment = optionalPayment.get();
        payment.setStatus("PAID");
        paymentRepo.save(payment);

        // ✅ Send verification email after approval
        Optional<Student> optionalStudent = studentRepo.findByUserUsername(payment.getStudentEmail());
        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            String email = student.getUser().getUsername();
            String verifyLink = "http://localhost:8080/api/stripe/verify-email?token=" + payment.getVerificationToken();

            emailService.sendVerificationEmail(email, verifyLink);
            System.out.println("📧 Verification email sent after bank slip approval to: " + email);
        }

        return ResponseEntity.ok("Payment approved and verification email sent");
    }



    @PutMapping("/mark-unpaid-overdue")
    public ResponseEntity<String> markUnpaidOverduePayments() {
        List<Payment> allPayments = paymentRepo.findAll();
        int updatedCount = 0;

        for (Payment payment : allPayments) {
            if ("PAID".equals(payment.getStatus()) && payment.getNextDueDate() != null) {
                LocalDate gracePeriodDate = payment.getNextDueDate().plusDays(7);
                if (LocalDate.now().isAfter(gracePeriodDate)) {
                    payment.setStatus("UNPAID");
                    paymentRepo.save(payment);
                    updatedCount++;
                }
            }
        }

        return ResponseEntity.ok(updatedCount + " payments marked as UNPAID due to overdue.");
    }


    @GetMapping("/payment-details")
    public ResponseEntity<Map<String, Object>> getStudentPaymentDetails(@RequestParam String username) {
        try {
            Optional<Student> optionalStudent = studentRepo.findByUserUsername(username);
            if (optionalStudent.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Collections.singletonMap("error", "Student not found for username: " + username));
            }

            List<Payment> payments = paymentRepo.findByStudentEmailOrderByPaymentDateDesc(username);
            if (payments.isEmpty()) {
                return ResponseEntity.ok(
                        Collections.singletonMap("message", "No payment records found for this student"));
            }

            Payment latestPayment = payments.get(0);
            Map<String, Object> response = new HashMap<>();
            response.put("amount", latestPayment.getAmount());
            response.put("nextDueDate", latestPayment.getNextDueDate());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error fetching payment details: " + e.getMessage());
            return ResponseEntity.status(500).body(
                    Collections.singletonMap("error", "Error fetching payment details: " + e.getMessage()));
        }
    }
}