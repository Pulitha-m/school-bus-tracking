package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepo extends JpaRepository<Route, Long> {

    Route findByBusId(Long busId);
}