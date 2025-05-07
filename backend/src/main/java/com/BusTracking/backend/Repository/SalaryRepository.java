package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Salary;
import com.BusTracking.backend.Model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    Optional<Salary> findByDriverIdAndMonth(Long driverId, LocalDate month);

}