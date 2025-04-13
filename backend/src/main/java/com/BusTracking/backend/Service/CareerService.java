package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.Bus;
import com.BusTracking.backend.Model.Career;
import com.BusTracking.backend.Repository.CareerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class CareerService {

    @Autowired
    private CareerRepo careerRepo;

    public Career applyCareer(Career career, MultipartFile cvImg, MultipartFile drivers_license)throws IOException {

        if (cvImg != null && !cvImg.isEmpty()) {
            byte[] imageBytes = cvImg.getBytes();
            System.out.println("Original Image Size: " + imageBytes.length + " bytes");
            career.setCvImage(imageBytes);
        }

        if (drivers_license != null && !drivers_license.isEmpty()) {
            byte[] imageBytes = drivers_license.getBytes();
            System.out.println("Original Image Size: " + imageBytes.length + " bytes");
            career.setDrivers_license(imageBytes);
        }



        System.out.println("Saving career request: " + career.getEmail());
        return careerRepo.save(career);
    }


    public List<Career> getAllCareerRequests(){

        List<Career>  careers = careerRepo.findAll();

        careers.forEach(career -> {
            if(career.getCvImage() != null && career.getDrivers_license() != null){
                career.setImageBase64(Base64.getEncoder().encodeToString(career.getCvImage()));
                career.setImageBase64(Base64.getEncoder().encodeToString(career.getDrivers_license()));
            }
        });

        return careers;

    }


    public Career getCareerReqById(Long id){


        Optional<Career> optCareer = careerRepo.findById(id);

        if (optCareer.isPresent()) {
            Career career = optCareer.get();
            System.out.println("Career retrieved: " + career.getEmail());
            if(career.getCvImage() != null && career.getDrivers_license() != null){
                career.setImageBase64(Base64.getEncoder().encodeToString(career.getCvImage()));
                career.setImageBase64(Base64.getEncoder().encodeToString(career.getDrivers_license()));
            }
            return career;
        } else {
            System.out.println("career not found with ID: " + id);
            return null;
        }


    }


    public String deleteCareer(Long id){

        if(!careerRepo.existsById(id)){

            return "Career with "+ id +" does not exist";
        }else{

            careerRepo.deleteById(id);
            return "Career with "+ id + " deleted successfully";
        }
    }

    public void updateCareerStatus(Career career) {
        careerRepo.save(career);
    }



}