package com.BusTracking.backend.Repository;

import com.Safetrack.back.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByBusIdOrderByTimestampDesc(String busId);

}
