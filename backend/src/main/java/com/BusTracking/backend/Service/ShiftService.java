package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.Shift;
import com.BusTracking.backend.Repository.ShiftRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class ShiftService {

    @Autowired
    private ShiftRepo shiftRepository;

    private static final LocalTime EXPECTED_SHIFT_START = LocalTime.of(7, 0); // 7:00 AM

    public Shift startShift(Long driverId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Shift shift = shiftRepository.findByDriverIdAndDate(driverId, today)
                .orElse(new Shift());

        shift.setDriverId(driverId);
        shift.setDate(today);
        shift.setShiftStart(now);
        shift.setIsLate(now.isAfter(EXPECTED_SHIFT_START));

        return shiftRepository.save(shift);
    }

    public Shift endShift(Long driverId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Shift shift = shiftRepository.findByDriverIdAndDate(driverId, today)
                .orElseThrow(() -> new RuntimeException("Shift not started"));

        shift.setShiftEnd(now);
        shift.setTotalWorkedTime(Duration.between(shift.getShiftStart(), now));

        return shiftRepository.save(shift);
    }

    public List<Shift> getShiftsForDriver(Long driverId) {
        return shiftRepository.findByDriverId(driverId);
    }

    public List<Shift> getAllShiftsForDriver() {
        return shiftRepository.findAll();
    }

}

