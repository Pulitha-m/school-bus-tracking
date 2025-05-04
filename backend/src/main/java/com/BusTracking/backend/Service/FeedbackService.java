package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.Feedback;
import com.BusTracking.backend.Repository.FeedbackRepo;
import com.BusTracking.backend.Repository.StudentRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepo feedbackRepository;
    private final StudentRepo studentRepository;

    public FeedbackService(FeedbackRepo feedbackRepository, StudentRepo studentRepository) {
        this.feedbackRepository = feedbackRepository;
        this.studentRepository = studentRepository;
    }

    public Feedback submitFeedback(Long studentId, Feedback feedback) {
        return studentRepository.findById(studentId).map(student -> {
            feedback.setStudent(student);
            return feedbackRepository.save(feedback);
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<Feedback> getFeedbackByStudentId(Long studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
