package com.BusTracking.backend.Service;



import com.BusTracking.backend.Model.Payment;
import com.BusTracking.backend.Model.User;
import com.BusTracking.backend.Repository.PaymentRepo;
import com.BusTracking.backend.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;

import java.time.LocalDate;
import java.util.Optional;

import static com.BusTracking.backend.Enums.ROLE.STUDENT;


@Service
public class AuthService {

    @Autowired
   private UserRepo userRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    private final PasswordEncoder passwordEncoder;



    public AuthService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }


    public User loginUserLocal(User user, HttpSession session) {
        System.out.println("Attempting to log in user with username: " + user.getUsername());

        User existingUser = userRepo.findByUsername(user.getUsername())
                .orElseThrow(() -> {
                    System.out.println("User not found: " + user.getUsername());
                    return new RuntimeException("User not found");
                });

        System.out.println("User found in database: " + existingUser.getUsername());

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            System.out.println("Invalid password attempt for user: " + user.getUsername());
            throw new RuntimeException("Invalid credentials");
        }

        System.out.println("Password matches for user: " + user.getUsername());

        if (!existingUser.isEmailVerified()) {
            System.out.println("User email is not verified: " + user.getUsername());
            throw new RuntimeException("Email is not verified");
        }

        System.out.println("Email verified for user: " + user.getUsername());

        // Additional check for STUDENT role payment status
        if (existingUser.getRole() == STUDENT) {
            System.out.println("Checking payment status for student: " + user.getUsername());

            // Find payment by student email (since your Payment model uses studentEmail)
            Optional<Payment> payment = paymentRepo.findByStudentEmail(existingUser.getUsername());

            if (payment.isEmpty()) {
                System.out.println("No payment record found for student: " + user.getUsername());
                throw new RuntimeException("Payment record not found. Please complete payment to login.");
            }

            Payment studentPayment = payment.get();
            if (!"PAID".equals(studentPayment.getStatus()) &&
                    !"APPROVED".equals(studentPayment.getStatus())) {
                System.out.println("Payment not completed for student: " + user.getUsername() +
                        " Status: " + studentPayment.getStatus());
                throw new RuntimeException("Payment not completed. Current status: " +
                        studentPayment.getStatus() + ". Please complete payment to login.");
            }

            // Optional: Check if payment is still valid (not expired)
            if (studentPayment.getNextDueDate() != null &&
                    studentPayment.getNextDueDate().isBefore(LocalDate.now())) {
                System.out.println("Payment expired for student: " + user.getUsername());
                throw new RuntimeException("Your payment has expired. Please make a new payment to login.");
            }

            System.out.println("Payment verified for student: " + user.getUsername() +
                    " Status: " + studentPayment.getStatus());
        }

        // Store user in session
        session.setAttribute("user", existingUser);
        System.out.println("User " + user.getUsername() + " stored in session");

        return existingUser;
    }



    public String logoutUser(HttpSession session) {
        session.invalidate();
        return "User logged out successfully";
}
}