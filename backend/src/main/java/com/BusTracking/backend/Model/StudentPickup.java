package com.BusTracking.backend.Model;

import jakarta.persistence.Embeddable;

@Embeddable
public class StudentPickup {

    private double latitude;
    private double longitude;
    private String studentEmail;
    private Boolean isPresent = true;



    public StudentPickup() {}
    public StudentPickup(double latitude, double longitude, String studentEmail,Boolean isPresent ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.studentEmail = studentEmail;
        this.isPresent = isPresent;

    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Boolean getIsPresent() {
        return isPresent;
    }

    public void setIsPresent(Boolean isPresent) {
        this.isPresent = isPresent;
    }
}