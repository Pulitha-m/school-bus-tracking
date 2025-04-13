package com.BusTracking.backend.Repository;


import com.Safetrack.back.Model.GpsData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GpsDataRepository extends JpaRepository<GpsData, Long> {

    GpsData findTopByOrderByIdDesc();
}
