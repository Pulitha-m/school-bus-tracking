package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Shift;
import com.BusTracking.backend.Service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/shifts")
// Adjust your React URL if needed
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @PostMapping("/start/{driverId}")
    public Shift startShift(@PathVariable Long driverId) {
        return shiftService.startShift(driverId);
    }

    @PostMapping("/end/{driverId}")
    public Shift endShift(@PathVariable Long driverId) {
        return shiftService.endShift(driverId);
    }

    @GetMapping("/driver/{driverId}")
    public List<Shift> getDriverShifts(@PathVariable Long driverId) {
        return shiftService.getShiftsForDriver(driverId);
    }

    @GetMapping("/getAll")
    public List<Shift> getAllDriverShifts() {
        return shiftService.getAllShiftsForDriver();
    }
}

