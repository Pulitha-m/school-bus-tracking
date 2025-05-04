package com.BusTracking.backend.Model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private User student; // Changed from Student to User

    private String name;
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date scannedAt;

    private long busId;

    public Attendance() {
        this.scannedAt = new Date(); // Automatically sets the scan time to current
    }


    public long getBusId() {
        return busId;
    }

    public void setBusId(long busId) {
        this.busId = busId;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(Date scannedAt) {
        this.scannedAt = scannedAt;
    }
}
