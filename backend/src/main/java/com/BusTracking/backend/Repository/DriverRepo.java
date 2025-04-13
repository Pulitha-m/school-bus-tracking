package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepo extends JpaRepository<Driver,Long> {
    Optional<Driver> findByBusId(Long busId);
    Driver findByUserUsername(String username); // email is stored as username


}