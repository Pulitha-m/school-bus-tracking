package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
    Optional<Payment> findByVerificationToken(String token);
    Optional<Payment> findByStripeSessionId(String stripeSessionId);
    Optional<Payment> findByStudentEmail(String studentEmail);
    Optional<Payment> findFirstByStudentEmailOrderByPaymentDateDesc(String studentEmail);
    List<Payment> findByStudentEmailOrderByPaymentDateDesc(String studentEmail);



}