package com.BusTracking.backend.Controller;

import com.Safetrack.back.Model.Location;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
public class BusLocationController {

    private final Map<String, SseEmitter> busLocationEmitters = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> subscriberCounts = new ConcurrentHashMap<>();

    // Endpoint to subscribe to location updates for a specific bus
    @GetMapping(value = "/get-location/{busId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeToLocation(@PathVariable String busId) {
        System.out.println("New subscription request for busId: " + busId);

        SseEmitter emitter = new SseEmitter(3600000L); // 1 hour timeout
        busLocationEmitters.put(busId, emitter);

        // Update subscriber count
        subscriberCounts.computeIfAbsent(busId, k -> new AtomicInteger(0)).incrementAndGet();

        // Handle SSE connection events
        emitter.onCompletion(() -> {
            busLocationEmitters.remove(busId);
            subscriberCounts.computeIfPresent(busId, (k, v) -> v.decrementAndGet() == 0 ? null : v);
        });

        emitter.onTimeout(() -> {
            busLocationEmitters.remove(busId);
            subscriberCounts.computeIfPresent(busId, (k, v) -> v.decrementAndGet() == 0 ? null : v);
        });

        return emitter;
    }

    // Endpoint to get active subscriber count
    @GetMapping("/subscriber-count/{busId}")
    public ResponseEntity<?> getSubscriberCount(@PathVariable String busId) {
        int count = subscriberCounts.getOrDefault(busId, new AtomicInteger(0)).get();
        return ResponseEntity.ok(Map.of(
                "busId", busId,
                "activeSubscribers", count
        ));
    }

    // Endpoint to receive bus location updates (called by driver)
    @PostMapping("/update-location/{busId}")
    public ResponseEntity<?> updateLocation(@PathVariable String busId, @RequestBody Location location) {
        // Get the SseEmitter associated with the busId
        SseEmitter emitter = busLocationEmitters.get(busId);
        int subscriberCount = subscriberCounts.getOrDefault(busId, new AtomicInteger(0)).get();

        if (emitter != null) {
            try {
                emitter.send(location);
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Location updated successfully",
                        "busId", busId,
                        "subscribers", subscriberCount,
                        "location", location
                ));
            } catch (IOException e) {
                emitter.completeWithError(e);
                return ResponseEntity.status(500).body(Map.of(
                        "status", "error",
                        "message", "Error sending location update",
                        "busId", busId
                ));
            }
        } else {
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Location received but no active subscribers",
                    "busId", busId,
                    "subscribers", subscriberCount,
                    "location", location
            ));
        }
    }
}