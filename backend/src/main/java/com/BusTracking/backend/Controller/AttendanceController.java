package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Attendance;
import com.BusTracking.backend.Model.User;
import com.BusTracking.backend.Repository.StudentRepo;
import com.BusTracking.backend.Repository.UserRepo;
import com.BusTracking.backend.Service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private UserRepo userRepo;

    // Fetch all attendance records (not just for a specific student)
    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        List<Attendance> attendanceRecords = attendanceService.getAllAttendance();
        return ResponseEntity.ok(attendanceRecords);
    }

    @PostMapping("/attendance/scan")
    public ResponseEntity<Attendance> addScan(@RequestBody Attendance attendance) {
        attendance.setScannedAt(new Date());
        return ResponseEntity.ok(attendanceService.saveAttendance(attendance));
    }

    @PostMapping("/addStatus")
    public ResponseEntity<?> addStatusRecord(
            @RequestParam("email") String email,
            @RequestParam("status") String status,
            @RequestParam("busId") long busId) {

        System.out.println("Received busId: " + busId);  // Log the busId
        Optional<User> studentOpt = userRepo.findByUsername(email);

        if (studentOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student with email " + email + " not found");
        }

        User student = studentOpt.get();

        // Create and populate the attendance record
        Attendance attendance = new Attendance();
        attendance.setEmail(email);
        attendance.setStatus(status);
        attendance.setScannedAt(new Date());
        attendance.setName(student.getUsername());
        attendance.setStudent(student); // Set the student reference
        attendance.setBusId(busId); // Set the busId here
        System.out.println("Bus ID Set in Attendance: " + attendance.getBusId());  // Log the busId in Attendance

        Attendance savedRecord = attendanceService.saveAttendance(attendance);
        return ResponseEntity.ok(savedRecord);
    }


    // Fetch all students' data (unchanged)
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepo.findAll();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/students/{email}")
    public ResponseEntity<User> getStudentByEmail(@PathVariable String email) {
        Optional<User> studentOpt = userRepo.findByUsername(email);
        if (studentOpt.isPresent()) {
            return ResponseEntity.ok(studentOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @GetMapping("/attendance/{email}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmail(@PathVariable String email) {
        List<Attendance> attendanceRecords = attendanceService.getAttendanceByEmail(email);
        return ResponseEntity.ok(attendanceRecords); // Always return 200 OK with records or []
    }




}
