package com.BusTracking.backend.Repository;


import com.BusTracking.backend.Model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;

public interface ShiftRepo extends JpaRepository<Shift, Long> {
    Optional<Shift> findByDriverIdAndDate(Long driverId, LocalDate date);
    List<Shift> findByDriverId(Long driverId);
}

