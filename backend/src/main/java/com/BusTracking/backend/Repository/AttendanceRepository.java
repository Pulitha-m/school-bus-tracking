package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmailOrderByScannedAtDesc(String email);

    List<Attendance> findByEmail(String email);

}
