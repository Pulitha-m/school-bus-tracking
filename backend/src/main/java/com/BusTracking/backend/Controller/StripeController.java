package com.BusTracking.backend.Controller;



import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")

public class StripeController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@RequestParam String email, @RequestParam String amount) {
        Stripe.apiKey = stripeApiKey;

        try {
            // Convert decimal amount (e.g., "6992.00") to long cents
            double amountDouble = Double.parseDouble(amount);
            long amountInCents = (long) (amountDouble * 100);

            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl("http://localhost:5173/registration-success?session_id={CHECKOUT_SESSION_ID}")
                            .setCancelUrl("http://localhost:5173/registration-cancelled")
                            .setCustomerEmail(email)
                            .addLineItem(
                                    SessionCreateParams.LineItem.builder()
                                            .setQuantity(1L)
                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData.builder()
                                                            .setCurrency("lkr") // or "lkr" if supported by your Stripe account
                                                            .setUnitAmount(amountInCents)
                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                            .setName("School Bus Monthly Fare")
                                                                            .build()
                                                            )
                                                            .build()
                                            )
                                            .build()
                            )
                            .build();

            Session session = Session.create(params);
            Map<String, String> response = new HashMap<>();
            response.put("url", session.getUrl());
            return response;

        } catch (Exception e) {
            throw new RuntimeException("Stripe session creation failed: " + e.getMessage());
        }
    }
}