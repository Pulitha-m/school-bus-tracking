package com.BusTracking.backend.Controller;

import com.Safetrack.back.Model.Notification;
import com.Safetrack.back.Repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepo notificationRepository;

    // Get notifications by busId (for drivers)
    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<Notification>> getNotificationsByBus(@PathVariable String busId) {
        List<Notification> notifications = notificationRepository.findByBusIdOrderByTimestampDesc(busId);
        return ResponseEntity.ok(notifications);
    }





    // Create new notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        notification.setTimestamp(new Date());
        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
    }
}