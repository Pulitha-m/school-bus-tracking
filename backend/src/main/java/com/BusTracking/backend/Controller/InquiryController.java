package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Inquiry;
import com.BusTracking.backend.Repository.InquiryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // adjust based on frontend URL
@RestController
@RequestMapping("/api/inquiry")
public class InquiryController {

    @Autowired
    private InquiryRepo inquiryRepo;

    @PostMapping
    public Inquiry createInquiry(@RequestBody Inquiry inquiry) {
        return inquiryRepo.save(inquiry);
    }

    // Get all inquiries
    @GetMapping
    public List<Inquiry> getAllInquiries() {
        return inquiryRepo.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteInquiry(@PathVariable Long id) {
        inquiryRepo.deleteById(id);
    }

}