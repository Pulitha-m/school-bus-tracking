package com.BusTracking.backend.Model;

import com.BusTracking.backend.Enums.ROLE;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED) // Ensures inheritance mapping
@DiscriminatorColumn(name = "role_type", discriminatorType = DiscriminatorType.STRING)  // Creates separate tables for subclasses
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate primary key
    private Long id;

    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private ROLE role;

    private boolean isEmailVerified;

    // Set default email verification status based on role
    @PrePersist
    public void prePersist() {
        if (this.role == ROLE.ADMIN || this.role == ROLE.DRIVER) {
            this.isEmailVerified = true;
        } else {
            this.isEmailVerified = false;
        }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ROLE getRole() {
        return role;
    }

    public void setRole(ROLE role) {
        this.role = role;
        // Ensure email verification status is updated when role changes
        if (role == ROLE.ADMIN || role == ROLE.DRIVER || role == ROLE.STUDENT) {
            this.isEmailVerified = true;
        }
    }

    public boolean isEmailVerified() {
        return isEmailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
}
}