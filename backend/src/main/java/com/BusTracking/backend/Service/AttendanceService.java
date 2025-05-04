package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.Attendance;
import com.BusTracking.backend.Model.User;
import com.BusTracking.backend.Repository.AttendanceRepository;
import com.BusTracking.backend.Repository.StudentRepo;
import com.BusTracking.backend.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepo userRepo;

    public List<Attendance> getAttendanceByEmail(String email) {
        return attendanceRepository.findByEmailOrderByScannedAtDesc(email);
    }

    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public void addStatusRecord(String qrCodeData, String status) {
        User student = userRepo.findByUsername(qrCodeData)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Attendance status1 = new Attendance();
        status1.setStudent(student);
        status1.setStatus(status);
        status1.setScannedAt(new Date());

        attendanceRepository.save(status1);
    }

    // Fetch all attendance records from the attendance table
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();  // Fetch all records from the AttendanceRepository
    }


}
