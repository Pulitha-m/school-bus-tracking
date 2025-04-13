package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.User;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.ByteArrayOutputStream;

@Service
public class DriverEmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") // Ensure SMTP credentials are set in application.properties
    private String fromEmail;

    public DriverEmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendCredentialsEmail(String toEmail,String rawPassword) {
        try {
            System.out.println("📩 Preparing PDF employment letter for: " + toEmail);

            // 1. Generate PDF in memory
            ByteArrayOutputStream pdfOutput = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, pdfOutput);
            document.open();

            Font bold = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font normal = new Font(Font.FontFamily.HELVETICA, 12);

            document.add(new Paragraph("EMPLOYMENT OFFER LETTER", bold));
            document.add(new Paragraph("\n" + new java.util.Date().toString(), normal));
            document.add(new Paragraph("\nTo,\n" + toEmail, normal));
            document.add(new Paragraph("\nSubject: Offer of Employment at Safetrack Pvt Ltd", bold));
            document.add(new Paragraph("\nDear Candidate,", normal));
            document.add(new Paragraph(
                    "\nWe are pleased to offer you the position of *Driver* at Safetrack Pvt Ltd. " +
                            "This offer is based on your qualifications, performance during the interview process, " +
                            "and the positive impression you left on our recruitment panel.\n", normal));

            document.add(new Paragraph(
                    "\nHere are the terms of your employment:\n", normal));
            document.add(new Paragraph(
                    "1. *Position*: Driver\n" +
                            "2. *Department*: Operations\n" +
                            "3. *Employment Type*: Full-Time\n" +
                            "4. *Joining Date*: Within 7 days from the date of this letter\n" +
                            "5. *Reporting To*: Transport Manager\n", normal));

            document.add(new Paragraph(
                    "\nYour login credentials for the internal system are as follows:\n" +
                            " - Email: " + toEmail + "\n" +
                            " - Temporary Password: " + rawPassword + "\n\n" +
                            "Please log in using the above credentials and change your password upon first login.\n", normal));

            document.add(new Paragraph(
                    "\nPlease bring original documents for verification on your first day of work. " +
                            "By accepting this offer, you agree to comply with all company policies and regulations.\n", normal));

            document.add(new Paragraph(
                    "\nWe are confident you will be a valuable asset to our team and look forward to working with you.\n", normal));

            document.add(new Paragraph(
                    "\nSincerely,\n\nHuman Resources Department\nSafetrack Pvt Ltd", normal));
            document.close();

            // 2. Create MimeMessage with attachment
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Offer Letter - Safetrack");

            helper.setText("Dear " + toEmail + ",\n\nPlease find attached your official offer letter with login credentials.\n\nRegards,\nSafetrack Team");

            helper.addAttachment("Safetrack_Offer_Letter.pdf", new ByteArrayDataSource(pdfOutput.toByteArray(), "application/pdf"));

            javaMailSender.send(mimeMessage);

            System.out.println("✅ PDF offer letter sent to " + toEmail);

        } catch (Exception e) {
            System.err.println("❌ Error sending acceptance letter: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send employment letter", e);
        }
    }
}