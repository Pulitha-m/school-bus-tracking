package com.BusTracking.backend.Repository;

import com.BusTracking.backend.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByBusIdOrderByTimestampDesc(String busId);


//    @Query("SELECT n FROM Notification n ORDER BY n.timestamp DESC LIMIT 1")
//    Notification findLatestNotification();

   Notification findFirstByBusIdOrderByTimestampDesc(String busId);



    @Query("SELECT n from Notification n where n.busId=:busId ORDER BY n.timestamp DESC")
    List<Notification> findLatestByBusId(@Param("busId") String busId);


}
