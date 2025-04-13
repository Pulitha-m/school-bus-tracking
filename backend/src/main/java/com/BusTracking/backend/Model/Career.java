package com.BusTracking.backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Career {

    @Id
    @GeneratedValue
    private Long id;



    private String name;
    private String email;



    private String phone;
    private String status;
    private String date;
    private boolean accountCreated = false;

    @Lob
    @Column(name = "cv", columnDefinition = "LONGBLOB")
    private byte[] cvImage;

    @Lob
    @Column(name = "drivers_license", columnDefinition = "LONGBLOB")
    private byte[] drivers_license;

    @Transient
    private String imageBase64;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public byte[] getDrivers_license() {
        return drivers_license;
    }

    public void setDrivers_license(byte[] drivers_license) {
        this.drivers_license = drivers_license;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public byte[] getCvImage() {
        return cvImage;
    }

    public void setCvImage(byte[] cvImage) {
        this.cvImage = cvImage;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isAccountCreated() {
        return accountCreated;
    }

    public void setAccountCreated(boolean accountCreated) {
        this.accountCreated = accountCreated;
    }
}