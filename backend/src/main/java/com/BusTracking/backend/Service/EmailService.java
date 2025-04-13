package com.BusTracking.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("SafeTrack Email Verification");
        message.setText("Dear Student,\n\nYour payment was successful! 🎉\n\nPlease verify your email by clicking the link below:\n\n" +
                link + "\n\nThis link will expire in 24 hours.\n\nSafe travels,\nSafeTrack Team");

        mailSender.send(message);
        System.out.println("✅ Verification email sent to " + toEmail);
    }
}