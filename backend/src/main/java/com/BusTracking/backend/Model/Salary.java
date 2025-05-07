package com.BusTracking.backend.Model;

import com.BusTracking.backend.Enums.PaymentStatus;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "salaries")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long driverId;

    private String username; // Driver's email

    private LocalDate month; // Stores the first day of the month (e.g., 2025-05-01)

    private double basicSalary; // LKR 60,000

    private double overtimePay; // Total OT pay for the month

    private double totalSalary; // basicSalary + overtimePay

    private double epf; // 20% of totalSalary (8% employee + 12% employer)

    private double etf; // 3% of totalSalary (employer)


    private String status; // PENDING, PAID, PROCESSING

    @Lob
    @Column(name = "slip_image", columnDefinition = "LONGBLOB")
    private byte[] slipImage;

    @Transient
    private String imageBase64; // Path to uploaded image

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDate getMonth() { return month; }
    public void setMonth(LocalDate month) { this.month = month; }

    public double getBasicSalary() { return basicSalary; }
    public void setBasicSalary(double basicSalary) { this.basicSalary = basicSalary; }

    public double getOvertimePay() { return overtimePay; }
    public void setOvertimePay(double overtimePay) { this.overtimePay = overtimePay; }

    public double getTotalSalary() { return totalSalary; }
    public void setTotalSalary(double totalSalary) { this.totalSalary = totalSalary; }

    public double getEpf() { return epf; }
    public void setEpf(double epf) { this.epf = epf; }

    public double getEtf() { return etf; }
    public void setEtf(double etf) { this.etf = etf; }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public byte[] getSlipImage() {
        return slipImage;
    }

    public void setSlipImage(byte[] slipImage) {
        this.slipImage = slipImage;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
}