package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.*;
import com.BusTracking.backend.Repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static com.BusTracking.backend.Enums.ROLE.DRIVER;

@Service
public class DriService {

    @Autowired
    private DriverRepo driRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CareerRepo careerRepo;

    @Autowired
    private BusRepo busRepo;

    @Autowired
    private RouteRepo routeRepo;

    @Autowired
    private DriverEmailService driEmailService;

    private static final Logger logger = LoggerFactory.getLogger(DriService.class);

    @Transactional
    public String createUserAccount(Long careerId) {
        logger.info("Starting createUserAccount for Career ID: {}", careerId);

        // 1. Find career or throw exception
        Career career = careerRepo.findById(careerId).orElseThrow(() -> {
            logger.error("Career not found with ID: {}", careerId);
            return new RuntimeException("Career not found");
        });

        String username = career.getEmail();

        // 2. Check if username already exists
        if (userRepo.existsByUsername(username)) {
            logger.warn("Username already exists: {}", username);
            throw new RuntimeException("Username already exists");
        }

        String rawPassword = generateRandomPassword(); // Generate password in plain text
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(rawPassword); // Hash password before storing

        // 1️⃣ Create and persist User entity
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword); // Store hashed password
        user.setRole(DRIVER);
        userRepo.save(user);

        logger.info("User saved successfully with ID: {}", user.getId());

        // 2️⃣ Create and persist Driver entity
        Driver drive = new Driver();
        drive.setUser(user);  // Set user object (User must already be created)
        drive.setFirstName(null);
        drive.setLastName(null);
        drive.setPhoneNumber(null);
        drive.setAddress(null);
        drive.setBusId(null);
        drive.setEmergencyContact(null);
        drive.setDob(null);
        driRepo.save(drive);

        logger.info("Driver saved successfully with ID: {}", drive.getId());

        // 3️⃣ Send the *unhashed password* via email
        driEmailService.sendCredentialsEmail(user.getUsername(), rawPassword);

        logger.info("User account created successfully, and credentials sent to {}", career.getEmail());
        return "User account created and credentials sent to " + career.getEmail();
    }


    private String generateRandomPassword() {
        int length = 10;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }
        return password.toString();
    }

    public Driver getDriverById(Long driverId) {
        Driver driver = driRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // Set Base64 image for frontend
        if (driver.getDriverImage() != null) {
            String base64Image = Base64.getEncoder().encodeToString(driver.getDriverImage());
            driver.setImageBase64(base64Image);
        }

        return driver;
    }

    public Driver assignBusToDriver(Long driverId, Long busId) {
        Driver driver = driRepo.findById(driverId).orElseThrow();
        Bus bus = busRepo.findById(busId).orElseThrow();

        // 🔒 Check if this bus is already assigned to another driver
        Optional<Driver> existingDriver = driRepo.findByBusId(busId);
        if (existingDriver.isPresent() && !existingDriver.get().getId().equals(driverId)) {
            throw new IllegalStateException("This bus is already assigned to another driver.");
        }

        driver.setBusId(bus.getBusId());
        bus.setDriverAssigned(true);
        busRepo.save(bus);

        // 🔁 Assign route based on bus (as route has busId)
        Route route = routeRepo.findByBusId(busId);
        if (route != null) {
            driver.setRouteId(route.getId());
        }

        return driRepo.save(driver);
    }

    public Driver updateDriverProfile(Long driverId, String firstName, String lastName,
                                      String phoneNumber, String address,
                                      String emergencyContact, Date dob,
                                      MultipartFile imageFile) {
        Driver driver = driRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (firstName != null) driver.setFirstName(firstName);
        if (lastName != null) driver.setLastName(lastName);
        if (phoneNumber != null) driver.setPhoneNumber(phoneNumber);
        if (address != null) driver.setAddress(address);
        if (emergencyContact != null) driver.setEmergencyContact(emergencyContact);
        if (dob != null) driver.setDob(dob);

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                driver.setDriverImage(imageFile.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to read image", e);
            }
        }

        return driRepo.save(driver);
    }


    public List<Driver> getAllDrivers() {
        return driRepo.findAll();
    }

    public String deleteDriver(Long driverId) {

        if(driRepo.existsById(driverId) && userRepo.existsById(driverId)) {
            userRepo.deleteById(driverId);
            driRepo.deleteById(driverId);
            return "Driver with "+driverId+ " deleted successfully";
        }else
            return "Driver not found";
    }

    public Driver getDriverByEmail(String email) {
        return driRepo.findByUserUsername(email);
    }







}