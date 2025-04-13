package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Career;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRepo extends JpaRepository<Career,Long> {
}