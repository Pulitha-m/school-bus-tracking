package com.BusTracking.backend.Controller;


import com.BusTracking.backend.Enums.ROLE;
import com.BusTracking.backend.Model.Student;
import com.BusTracking.backend.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Create a new student - NO CHANGES
    @PostMapping("/registerStudent")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        try {
            // Verify user data exists
            if (student.getUser() == null) {
                throw new IllegalArgumentException("User details must be provided");
            }

            // Set default role if not provided
            if (student.getUser().getRole() == null) {
                student.getUser().setRole(ROLE.STUDENT);
            }

            // Set email verification status
            student.getUser().setEmailVerified(true);

            Student createdStudent = studentService.createStudent(student);
            return ResponseEntity.ok(createdStudent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get student by ID - NO CHANGES
    @GetMapping("/getStudentById/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        try {
            Student student = studentService.getStudentById(id);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getStudentByEmail/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        try {
            // If student exists, return the student data
            Student student = studentService.getStudentByUserUsername(email)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Return 404 if student not found
        }
    }



    // Get all students - NO CHANGES
    @GetMapping("/getAllStudents")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Update student by ID - NO CHANGES
    @PutMapping("/updateStudent/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete student by ID - ONLY CHANGED METHOD
    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        String result = studentService.deleteStudent(id);
        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    // Get students by bus ID - NO CHANGES
    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<Student>> getStudentsByBusId(@PathVariable Long busId) {
        return ResponseEntity.ok(studentService.getStudentsByBusId(busId));
}


}