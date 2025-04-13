package com.BusTracking.backend.Repository;


import com.BusTracking.backend.Enums.ROLE;
import com.BusTracking.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {

    Optional<User> findByRole(ROLE role);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}