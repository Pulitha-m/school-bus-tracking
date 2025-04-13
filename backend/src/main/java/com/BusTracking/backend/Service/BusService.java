package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.Bus;
import com.BusTracking.backend.Repository.BusRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    @Autowired
    private BusRepo busRepo;

    public Bus saveBus(Bus bus, MultipartFile busImage) throws IOException {

        if (busImage != null && !busImage.isEmpty()) {
            byte[] imageBytes = busImage.getBytes();
            System.out.println("Original Image Size: " + imageBytes.length + " bytes");
            bus.setBusImage(imageBytes);
        }
        System.out.println("Saving product: " + bus.getNoPlate());
        return busRepo.save(bus);
    }


    public List<Bus> getAllBusses(){

        List<Bus>  bus =  busRepo.findAll();

        bus.forEach(product -> {
            if (product.getBusImage() != null) {
                product.setImageBase64(Base64.getEncoder().encodeToString(product.getBusImage()));
            }
        });
        return bus;
    }


    public Bus getBusById(Long busId){

        Optional<Bus> optionalProduct = busRepo.findById(busId);
        if (optionalProduct.isPresent()) {
            Bus bus = optionalProduct.get();
            System.out.println("Bus retrieved: " + bus.getNoPlate());
            if (bus.getBusImage() != null) {
                bus.setImageBase64(Base64.getEncoder().encodeToString(bus.getBusImage()));
            }
            return bus;
        } else {
            System.out.println("Bus not found with ID: " + busId);
            return null;
        }
    }


    public Bus updateBus(Bus newBus, Long id, MultipartFile imageFile) throws IOException {
        Optional<Bus> optionalBus = busRepo.findById(id);
        if (optionalBus.isPresent()) {
            Bus existingBus = optionalBus.get();

            // Update bus fields only if they are not null
            existingBus.setModel(newBus.getModel() != null ? newBus.getModel() : existingBus.getModel());
            existingBus.setMake(newBus.getMake() != null ? newBus.getMake() : existingBus.getMake());
            existingBus.setNoPlate(newBus.getNoPlate() != null ? newBus.getNoPlate() : existingBus.getNoPlate());
            existingBus.setCapacity(newBus.getCapacity() > 0 ? newBus.getCapacity() : existingBus.getCapacity());
            existingBus.setStatus(newBus.getStatus() != null ? newBus.getStatus() : existingBus.getStatus());

            // Update image if a new file is provided
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] imageBytes = imageFile.getBytes();
                System.out.println("Updated Image Size: " + imageBytes.length + " bytes");
                existingBus.setBusImage(imageBytes);
            }

            Bus updatedBus = busRepo.save(existingBus);
            System.out.println("Bus updated: " + updatedBus.getNoPlate());
            return updatedBus;
        } else {
            System.out.println("Bus not found with ID: " + id);
            return null;
        }
    }


    public String deleteBus(Long id){

        if(!busRepo.existsById(id)){
            return "Bus with id " + id + " does not exist";
        }else{
            busRepo.deleteById(id);
            return "Bus with id "+ id +" deleted successfully";
        }

    }



}