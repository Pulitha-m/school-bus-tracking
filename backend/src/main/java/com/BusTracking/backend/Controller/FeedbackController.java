package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Feedback;
import com.BusTracking.backend.Repository.FeedbackRepo;
import com.BusTracking.backend.Service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    private FeedbackRepo feedbackRepository;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/{studentId}")
    public ResponseEntity<Feedback> submitFeedback(@PathVariable Long studentId, @RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.submitFeedback(studentId, feedback));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Feedback>> getFeedbackForStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByStudentId(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // New endpoint to get all feedbacks
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbackList = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbackList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Feedback>> getLatestFeedbacks() {
        List<Feedback> latestFeedbacks = feedbackService.getLatestFeedbacks();
        return ResponseEntity.ok(latestFeedbacks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestBody Feedback updatedFeedback) {
        Optional<Feedback> existingFeedbackOpt = feedbackRepository.findById(id);

        if (existingFeedbackOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback not found");
        }

        Feedback existingFeedback = existingFeedbackOpt.get();

        // Update fields
        existingFeedback.setName(updatedFeedback.getName());
        existingFeedback.setPunctuality(updatedFeedback.getPunctuality());
        existingFeedback.setPunctualityComment(updatedFeedback.getPunctualityComment());
        existingFeedback.setDriverBehavior(updatedFeedback.getDriverBehavior());
        existingFeedback.setDriverExperience(updatedFeedback.getDriverExperience());
        existingFeedback.setVehicleCondition(updatedFeedback.getVehicleCondition());
        existingFeedback.setVehicleNotes(updatedFeedback.getVehicleNotes());
        existingFeedback.setSafety(updatedFeedback.getSafety());
        existingFeedback.setSafetyExplanation(updatedFeedback.getSafetyExplanation());
        existingFeedback.setSafetyProtocols(updatedFeedback.getSafetyProtocols());
        existingFeedback.setSafetyConcerns(updatedFeedback.getSafetyConcerns());
        existingFeedback.setCommunication(updatedFeedback.getCommunication());
        existingFeedback.setCommunicationSuggestions(updatedFeedback.getCommunicationSuggestions());
        existingFeedback.setRating(updatedFeedback.getRating());
        existingFeedback.setMessage(updatedFeedback.getMessage());

        feedbackRepository.save(existingFeedback);

        return ResponseEntity.ok("Feedback updated successfully");
    }




}
