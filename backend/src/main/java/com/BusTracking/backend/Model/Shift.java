package com.BusTracking.backend.Model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long driverId;

    private LocalDate date;

    private LocalTime shiftStart;

    private LocalTime shiftEnd;

    private Duration totalWorkedTime;

    private Boolean isLate;

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getDriverId() { return driverId; }

    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public LocalDate getDate() { return date; }

    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getShiftStart() { return shiftStart; }

    public void setShiftStart(LocalTime shiftStart) { this.shiftStart = shiftStart; }

    public LocalTime getShiftEnd() { return shiftEnd; }

    public void setShiftEnd(LocalTime shiftEnd) { this.shiftEnd = shiftEnd; }

    public Duration getTotalWorkedTime() { return totalWorkedTime; }

    public void setTotalWorkedTime(Duration totalWorkedTime) { this.totalWorkedTime = totalWorkedTime; }

    public Boolean getIsLate() { return isLate; }

    public void setIsLate(Boolean isLate) { this.isLate = isLate; }
}

