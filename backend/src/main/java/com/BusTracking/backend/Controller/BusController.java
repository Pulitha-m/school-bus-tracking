package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Enums.busStatus;
import com.BusTracking.backend.Model.Bus;
import com.BusTracking.backend.Service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController

public class BusController {

    @Autowired
    private BusService busService;

    @PostMapping("/registerBus")
    public ResponseEntity<?> registerBus(
            @RequestParam String make,
            @RequestParam String model,
            @RequestParam String noPlate,
            @RequestParam int capacity,
            @RequestParam String status,  // Enum values must be sent as a string

            @RequestParam MultipartFile busImg) {

        try {
            // Create a Bus object manually
            Bus bus = new Bus();
            bus.setMake(make);
            bus.setModel(model);
            bus.setNoPlate(noPlate);
            bus.setCapacity(capacity);
            bus.setStatus(busStatus.valueOf(status.toUpperCase()));  // Convert String to Enum


            // Call service to save bus
            Bus savedBus = busService.saveBus(bus, busImg);
            return ResponseEntity.ok(savedBus);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error registering bus: " + e.getMessage());
        }
    }


    @GetMapping("/getAllBusses")
    public List<Bus> getAll(){
        return busService.getAllBusses();
    }


    @GetMapping("/getBusById/{id}")
    public Bus getBusById(@PathVariable  Long id){
        return busService.getBusById(id);
    }

    @DeleteMapping("/deleteBus/{id}")
    public String deleteBus(@PathVariable  Long id){
        return busService.deleteBus(id);
    }

    @PutMapping("/updateBus/{id}")
    public ResponseEntity<?> updateBus(
            @PathVariable Long id,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String noPlate,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String status,

            @RequestParam(required = false) MultipartFile busImg) {

        try {
            // Create a Bus object with provided fields
            Bus updatedBus = new Bus();
            if (model != null) updatedBus.setModel(model);
            if (noPlate != null) updatedBus.setNoPlate(noPlate);
            if (capacity != null) updatedBus.setCapacity(capacity);
            if (status != null) updatedBus.setStatus(busStatus.valueOf(status.toUpperCase()));
            if(status != null) updatedBus.setMake(make);

            // Call service to update the bus
            Bus savedBus = busService.updateBus(updatedBus, id, busImg);
            return ResponseEntity.ok(savedBus);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating bus: " + e.getMessage());
        }
    }
}