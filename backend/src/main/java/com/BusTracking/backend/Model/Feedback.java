package com.BusTracking.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String punctuality;
    private String punctualityComment;
    private String driverBehavior;
    private String driverExperience;
    private String vehicleCondition;
    private String vehicleNotes;
    private String safety;
    private String safetyExplanation;
    private String safetyProtocols;
    private String safetyConcerns;
    private String communication;
    private String communicationSuggestions;
    private int rating; // overallRating
    private String message; // generalFeedback
    private String username;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @PrePersist
    public void prePersist() {
        submittedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPunctuality() {
        return punctuality;
    }

    public void setPunctuality(String punctuality) {
        this.punctuality = punctuality;
    }

    public String getPunctualityComment() {
        return punctualityComment;
    }

    public void setPunctualityComment(String punctualityComment) {
        this.punctualityComment = punctualityComment;
    }

    public String getDriverBehavior() {
        return driverBehavior;
    }

    public void setDriverBehavior(String driverBehavior) {
        this.driverBehavior = driverBehavior;
    }

    public String getDriverExperience() {
        return driverExperience;
    }

    public void setDriverExperience(String driverExperience) {
        this.driverExperience = driverExperience;
    }

    public String getVehicleCondition() {
        return vehicleCondition;
    }

    public void setVehicleCondition(String vehicleCondition) {
        this.vehicleCondition = vehicleCondition;
    }

    public String getVehicleNotes() {
        return vehicleNotes;
    }

    public void setVehicleNotes(String vehicleNotes) {
        this.vehicleNotes = vehicleNotes;
    }

    public String getSafety() {
        return safety;
    }

    public void setSafety(String safety) {
        this.safety = safety;
    }

    public String getSafetyExplanation() {
        return safetyExplanation;
    }

    public void setSafetyExplanation(String safetyExplanation) {
        this.safetyExplanation = safetyExplanation;
    }

    public String getSafetyProtocols() {
        return safetyProtocols;
    }

    public void setSafetyProtocols(String safetyProtocols) {
        this.safetyProtocols = safetyProtocols;
    }

    public String getSafetyConcerns() {
        return safetyConcerns;
    }

    public void setSafetyConcerns(String safetyConcerns) {
        this.safetyConcerns = safetyConcerns;
    }

    public String getCommunication() {
        return communication;
    }

    public void setCommunication(String communication) {
        this.communication = communication;
    }

    public String getCommunicationSuggestions() {
        return communicationSuggestions;
    }

    public void setCommunicationSuggestions(String communicationSuggestions) {
        this.communicationSuggestions = communicationSuggestions;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
