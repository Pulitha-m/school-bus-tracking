package com.BusTracking.backend.Model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@DiscriminatorValue("DRIVER")
public class Driver {

    @Id
    private Long id; // FK (same as User's ID)

    @OneToOne
    @MapsId // Ensures the same ID as User
    @JoinColumn(name = "id") // Foreign key mapping
    private User user;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private Long busId;
    private Long routeId;
    private String emergencyContact;

    @Temporal(TemporalType.DATE)
    private Date dob;

    @Lob
    @Column(name = "driver_image", columnDefinition = "LONGBLOB")
    private byte[] driverImage;

    @Transient
    private String imageBase64;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public byte[] getDriverImage() {
        return driverImage;
    }

    public void setDriverImage(byte[] driverImage) {
        this.driverImage = driverImage;
    }
}