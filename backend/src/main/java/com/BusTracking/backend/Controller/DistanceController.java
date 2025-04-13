package com.BusTracking.backend.Controller;


import com.BusTracking.backend.Service.GoogleDistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Allow frontend requests
@RestController
@RequestMapping("/api")
public class DistanceController {

    @Autowired
    private GoogleDistanceService googleDistanceService;

    @GetMapping("/getDistance")
    public String getDistance(@RequestParam String origins, @RequestParam String destinations) {
        return googleDistanceService.getDistance(origins, destinations);
    }

    @PostMapping("/getRouteWithWaypoints")
    public String getRouteWithWaypoints(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam List<String> waypoints) {

        // Call the service to get the route with waypoints
        return googleDistanceService.getRouteWithWaypoints(origin, destination, waypoints);
    }

    @PostMapping("/getRoute")
    public String getRouteWithWaypoints(
            @RequestParam String origin,
            @RequestParam String destination) {

        // Call the service to get the route with waypoints
        return googleDistanceService.getSimpleRoute(origin, destination);
    }
}