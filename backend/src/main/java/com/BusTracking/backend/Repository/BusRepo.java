package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepo extends JpaRepository<Bus,Long> {
}
