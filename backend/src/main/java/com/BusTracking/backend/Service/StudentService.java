package com.BusTracking.backend.Service;


import com.BusTracking.backend.Enums.ROLE;
import com.BusTracking.backend.Model.Student;
import com.BusTracking.backend.Model.User;
import com.BusTracking.backend.Repository.StudentRepo;
import com.BusTracking.backend.Repository.UserRepo;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private UserRepo userRepo;

//    @Autowired
//    private BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public Student createStudent(Student student) {
        logger.info("Starting student creation process");

        // Validate student and user data
        if (student == null || student.getUser() == null) {
            logger.error("Student or User data is null");
            throw new IllegalArgumentException("Student and User data must be provided");
        }

        User user = student.getUser();

        // Validate required fields
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Encode password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set role if not set
        if (user.getRole() == null) {
            user.setRole(ROLE.STUDENT);
        }

        // Save user
        User savedUser = userRepo.save(user);
        logger.info("User created with ID: {}", savedUser.getId());

        // Set user to student
        student.setUser(savedUser);

        // === QR Code Generation ===
        try {
            String qrData = savedUser.getUsername(); // or "STUDENT_" + id
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 200, 200);

            BufferedImage qrImage = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < 200; x++) {
                for (int y = 0; y < 200; y++) {
                    qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            String base64Qr = Base64.getEncoder().encodeToString(baos.toByteArray());

            // Set QR code to student
            student.setQrCodeBase64(base64Qr);

        } catch (WriterException | java.io.IOException e) {
            logger.error("Failed to generate QR code", e);
            throw new RuntimeException("QR code generation failed");
        }

        // Save student
        Student savedStudent = studentRepository.save(student);
        logger.info("Student created with ID: {}", savedStudent.getId());

        return savedStudent;
    }

    private void validateUserDetails(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
    }

    private void processUserDetails(User user) {

        String rawPassword = user.getPassword();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);

        if (user.getRole() == null) {
            user.setRole(ROLE.STUDENT);
        }
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional
    public Student updateStudent(Long id, Student studentUpdates) {
Student existingStudent = studentRepository.findById(id)
.orElseThrow(() -> new RuntimeException("Student not found"));

if (studentUpdates.getFirstName() != null) {
existingStudent.setFirstName(studentUpdates.getFirstName());
}
if (studentUpdates.getLastName() != null) {
existingStudent.setLastName(studentUpdates.getLastName());
}
if (studentUpdates.getStartLocation() != null) {
existingStudent.setStartLocation(studentUpdates.getStartLocation());
}
if (studentUpdates.getEndLocation() != null) {
existingStudent.setEndLocation(studentUpdates.getEndLocation());
}
if (studentUpdates.getEmergencyName() != null) {
existingStudent.setEmergencyName(studentUpdates.getEmergencyName());
}
if (studentUpdates.getEmergencyPhone() != null) {
existingStudent.setEmergencyPhone(studentUpdates.getEmergencyPhone());
}
if (studentUpdates.getEmergencyRelation() != null) {
existingStudent.setEmergencyRelation(studentUpdates.getEmergencyRelation());
}
if (studentUpdates.getAllergies() != null) {
existingStudent.setAllergies(studentUpdates.getAllergies());
}
if (studentUpdates.getMedicalNotes() != null) {
existingStudent.setMedicalNotes(studentUpdates.getMedicalNotes());
}

// Update user fields if needed
if (studentUpdates.getUser() != null) {
User existingUser = existingStudent.getUser();
User updatedUser = studentUpdates.getUser();

if (updatedUser.getPassword() != null) {
BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
}
if (updatedUser.getUsername() != null) {
existingUser.setUsername(updatedUser.getUsername());
}
}

return studentRepository.save(existingStudent);
    }


    @Transactional
    public String deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return "Student with ID " + id + " deleted successfully";
        }
        return "Student not found";
    }

    public List<Student> getStudentsByBusId(Long busId) {
        return studentRepository.findByBusId(busId);
    }

    public Optional<Student> getStudentByUserUsername(String username) {
        return studentRepository.findByUserUsername(username);
}
}