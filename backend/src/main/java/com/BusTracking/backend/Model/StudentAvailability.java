package com.BusTracking.backend.Model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class StudentAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean coming = true; // Capital Boolean - default true

    @Temporal(TemporalType.DATE)
    private Date date;

    private String reason; // Only if not coming

    private String attendanceType; // Morning, Evening, Both (only if not coming)

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String busId;

    @Column(nullable = false)
    private String noPlate;

    @Column(nullable = false)
    private String studentName;

    public StudentAvailability() {}

    public StudentAvailability(Boolean coming, Date date, String reason,
                               String attendanceType, String email, String busId, String studentName) {
        this.coming = coming;
        this.date = date;
        this.reason = reason;
        this.attendanceType = attendanceType;
        this.email = email;
        this.busId = busId;
        this.studentName = studentName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Boolean getComing() { // <--- getter should be getComing()
        return coming;
    }

    public void setComing(Boolean coming) {
        this.coming = coming;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getAttendanceType() {
        return attendanceType;
    }

    public void setAttendanceType(String attendanceType) {
        this.attendanceType = attendanceType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBusId() {
        return busId;
    }

    public void setBusId(String busId) {
        this.busId = busId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getNoPlate() {
        return noPlate;
    }

    public void setNoPlate(String noPlate) {
        this.noPlate = noPlate;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}
