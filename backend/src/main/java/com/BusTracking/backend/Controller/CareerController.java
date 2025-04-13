package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Career;
import com.BusTracking.backend.Service.BusService;
import com.BusTracking.backend.Service.CareerEmailService;
import com.BusTracking.backend.Service.CareerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin
@RestController
public class CareerController {

    @Autowired
    private CareerService careerService;

    @Autowired
    private CareerEmailService careerEmailService;

    @PostMapping("/applyCareer")
    public ResponseEntity<?> applyCareer(@RequestParam String name,
                                         @RequestParam String email,
                                         @RequestParam String phone,
                                         @RequestParam String status,
                                         @RequestParam String date,

                                         @RequestParam MultipartFile cvImg,
                                         @RequestParam MultipartFile driving_license
    ){


        try {
            Career career = new Career();
            career.setName(name);
            career.setEmail(email);
            career.setPhone(phone);
            career.setStatus(status);
            career.setDate(date);

            careerService.applyCareer(career,cvImg,driving_license);
            return ResponseEntity.ok(career);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error applying career: " + e.getMessage());
        }
    }


    @GetMapping("/getAllCareerReq")
    public List<Career> getAllCareerReq(){

        return careerService.getAllCareerRequests();
    }

    @GetMapping("/getCareerReqById/{id}")
    public Career getCareerById(@PathVariable Long id){

        return careerService.getCareerReqById(id);
    }

    @DeleteMapping("/deleteCareer/{id}")
    public String deleteCareer(@PathVariable Long id){

        return careerService.deleteCareer(id);

    }

    @PostMapping("/callInterview")
    public ResponseEntity<?> callInterview() {
        try {
            List<Career> careers = careerService.getAllCareerRequests();

            for (Career career : careers) {
                if (!"INTERVIEW CALLED".equalsIgnoreCase(career.getStatus())) {
                    careerEmailService.sendInterviewEmail(career.getEmail(), career.getName());
                    career.setStatus("INTERVIEW CALLED");
                    careerService.updateCareerStatus(career); // Save status
                }
            }

            return ResponseEntity.ok("Interview invitations sent to eligible applicants.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending interview invitations: " + e.getMessage());
        }
    }

    @PutMapping("/updateCareerStatus/{id}")
    public ResponseEntity<?> updateCareerStatus(@PathVariable Long id,
                                                @RequestParam String status) {
        try {
            Career career = careerService.getCareerReqById(id);
            career.setStatus(status);
            careerService.updateCareerStatus(career);
            return ResponseEntity.ok("Career status updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating status: " + e.getMessage());
        }
    }


}