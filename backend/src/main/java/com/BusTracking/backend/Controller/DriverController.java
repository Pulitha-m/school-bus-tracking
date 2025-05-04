package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Driver;
import com.BusTracking.backend.Service.DriService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@RestController
public class DriverController {

    @Autowired
    private DriService driverService;

    @PostMapping("/createDriAccount/{careerId}")
    public ResponseEntity<?> createUserAccount(@PathVariable Long careerId) {
        try {

            String response = driverService.createUserAccount(careerId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating user account: " + e.getMessage());
        }
    }

    @GetMapping("/getDriverById/{driverId}")
    public ResponseEntity<?> getDriverById(@PathVariable Long driverId) {

        return ResponseEntity.ok(driverService.getDriverById(driverId));
    }

    @PutMapping("/updateDriver/{driverId}")
    public ResponseEntity<Driver> updateDriver(
            @PathVariable Long driverId,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String emergencyContact,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dob,
            @RequestParam(required = false) MultipartFile image
    ) {
        Driver updatedDriver = driverService.updateDriverProfile(driverId, firstName, lastName, phoneNumber, address, emergencyContact, dob, image);
        return ResponseEntity.ok(updatedDriver);
    }


    @PutMapping("/assign-bus/{driverId}/{busId}")
    public ResponseEntity<Driver> assignBus(@PathVariable Long driverId, @PathVariable Long busId) {
        Driver updatedDriver = driverService.assignBusToDriver(driverId, busId);
        return ResponseEntity.ok(updatedDriver);
    }

    @GetMapping("/getAllDrivers")
    public List<Driver> getAll(){
        return driverService.getAllDrivers();
    }

    @DeleteMapping("/deleteDriverById/{driverId}")
    public String deleteDriverById(@PathVariable Long driverId) {
        return driverService.deleteDriver(driverId);
    }

    @GetMapping("/getDriverByEmail/{email}")
    public ResponseEntity<Driver> getDriverByEmail(@PathVariable String email) {
        Driver driver = driverService.getDriverByEmail(email);
        if (driver != null) {
            return ResponseEntity.ok(driver);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}