package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Notification;
import com.BusTracking.backend.Repository.NotificationRepo;
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


    @GetMapping("/getAll")
    public ResponseEntity<List<Notification>> getNotificationsByBus() {
        List<Notification> notifications = notificationRepository.findAll();
        return ResponseEntity.ok(notifications);
    }






    // Create new notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        notification.setTimestamp(new Date());
        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        // Check if notification exists
        if (!notificationRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if not found
        }

        // Set the ID and timestamp for the update
        notification.setId(id);
        notification.setTimestamp(new Date());
        Notification updatedNotification = notificationRepository.save(notification);
        return ResponseEntity.ok(updatedNotification);
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Notification deleted successfully");
    }

}