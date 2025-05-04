package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.StudentAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface StudentAvailabilityRepo extends JpaRepository<StudentAvailability, Long> {
    List<StudentAvailability> findByEmail(String email);

    List<StudentAvailability> findByBusId(String busId);

    Optional<StudentAvailability> findByEmailAndDate(String email, Date date);

    @Query("SELECT sa FROM StudentAvailability sa WHERE sa.email = :email AND sa.id = :id")
    Optional<StudentAvailability> findByIdAndEmail(@Param("id") Long id, @Param("email") String email);
}
