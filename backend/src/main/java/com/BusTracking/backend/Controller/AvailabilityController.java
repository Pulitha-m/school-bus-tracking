package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.StudentAvailability;
import com.BusTracking.backend.Repository.StudentAvailabilityRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    @Autowired
    private StudentAvailabilityRepo availabilityRepo;

    @PostMapping
    public ResponseEntity<?> submitAvailability(@RequestBody StudentAvailability availability) {
        // Check if already exists for this date and email
        Optional<StudentAvailability> existing = availabilityRepo.findByEmailAndDate(
                availability.getEmail(), availability.getDate());

        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("You have already submitted availability for this date");
        }

        // Set default coming = true if not provided
        if (availability.getComing() == null) {
            availability.setComing(true);
        }

        // If coming = true, clear reason and attendanceType
        if (availability.getComing()) {
            availability.setReason(null);
            availability.setAttendanceType(null);
        }

        StudentAvailability savedAvailability = availabilityRepo.save(availability);
        return ResponseEntity.ok(savedAvailability);
    }

    @GetMapping("/student/{email}")
    public List<StudentAvailability> getStudentAvailability(@PathVariable String email) {
        return availabilityRepo.findByEmail(email);
    }

    @GetMapping("/bus/{busId}")
    public List<StudentAvailability> getStudentAvailabilityByBus(@PathVariable String busId) {
        return availabilityRepo.findByBusId(busId);
    }

    @GetMapping("/getAll")
    public List<StudentAvailability> getAllStudentAvailability() {
        return availabilityRepo.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAvailability(
            @PathVariable Long id,
            @RequestBody StudentAvailability updatedAvailability) {

        Optional<StudentAvailability> existing = availabilityRepo.findByIdAndEmail(
                id, updatedAvailability.getEmail());

        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        StudentAvailability availability = existing.get();

        // Update fields
        availability.setComing(updatedAvailability.getComing() != null ? updatedAvailability.getComing() : true);
        availability.setDate(updatedAvailability.getDate());

        if (availability.getComing()) {
            availability.setReason(null);
            availability.setAttendanceType(null);
        } else {
            availability.setReason(updatedAvailability.getReason());
            availability.setAttendanceType(updatedAvailability.getAttendanceType());
        }

        StudentAvailability savedAvailability = availabilityRepo.save(availability);
        return ResponseEntity.ok(savedAvailability);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {

        Optional<StudentAvailability> availability = availabilityRepo.findById(id);
        if (!availability.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        availabilityRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
