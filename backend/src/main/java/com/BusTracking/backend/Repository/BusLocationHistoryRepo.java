package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.BusLocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BusLocationHistoryRepo extends JpaRepository<BusLocationHistory, Long> {
    List<BusLocationHistory> findByBusIdOrderByTimestampDesc(String busId);

    @Query("SELECT h FROM BusLocationHistory h WHERE h.timestamp IN (SELECT MAX(h2.timestamp) FROM BusLocationHistory h2 GROUP BY h2.busId)")
    List<BusLocationHistory> findLatestLocations();

}
