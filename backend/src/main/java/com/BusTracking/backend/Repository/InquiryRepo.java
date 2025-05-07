package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepo extends JpaRepository<Inquiry, Long> {
}