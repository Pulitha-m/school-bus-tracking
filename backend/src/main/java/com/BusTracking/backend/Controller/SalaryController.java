package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Salary;
import com.BusTracking.backend.Enums.PaymentStatus;
import com.BusTracking.backend.Service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @GetMapping("/calculate")
    public ResponseEntity<List<Salary>> calculateMonthlySalaries() {
        List<Salary> salaries = salaryService.calculateMonthlySalaries();
        return ResponseEntity.ok(salaries);
    }

    @PostMapping("/upload-slip")
    public ResponseEntity<Salary> uploadSalarySlip(
            @RequestParam("driverId") Long driverId,
            @RequestParam("month") String month, // Format: YYYY-MM
            @RequestParam("slip") MultipartFile slip) throws IOException {
        LocalDate monthDate = LocalDate.parse(month + "-01");
        Salary salary = salaryService.uploadSalarySlip(driverId, monthDate, slip);
        return ResponseEntity.ok(salary);
    }

    @PutMapping("/update-status")
    public ResponseEntity<Salary> updatePaymentStatus(
            @RequestParam("driverId") Long driverId,
            @RequestParam("month") String month,
            @RequestParam("status") String status) {
        LocalDate monthDate = LocalDate.parse(month + "-01");
        PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
        Salary salary = salaryService.updatePaymentStatus(driverId, monthDate, paymentStatus.toString());
        return ResponseEntity.ok(salary);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Salary>> getAllSalaries() {
        List<Salary> salaries = salaryService.getAllSalaries();
        return ResponseEntity.ok(salaries);
    }




}