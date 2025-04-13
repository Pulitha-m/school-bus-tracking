package com.BusTracking.backend.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class CareerEmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") // Make sure to set your SMTP credentials in application.properties
    private String fromEmail;

    public CareerEmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    // Send an interview invitation email to a user
    public void sendInterviewEmail(String toEmail, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Interview Invitation");
            message.setText("Dear " + name + ",\n\n" +
                    "We are pleased to invite you for an interview for the position you applied for. " +
                    "Please contact us to schedule a convenient time.\n\n" +
                    "Best regards,\n" +
                    "The Safetrack Team");

            // Send the email
            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error sending email to " + toEmail);
        }
    }


}