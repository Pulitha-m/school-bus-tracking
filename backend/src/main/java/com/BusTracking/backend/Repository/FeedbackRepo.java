package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
    List<Feedback> findByStudentId(Long studentId);
}

