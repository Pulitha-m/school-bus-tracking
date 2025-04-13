package com.BusTracking.backend.Controller;

import com.BusTracking.backend.Model.Route;
import com.BusTracking.backend.Service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RouteController {

    @Autowired
    private RouteService routeService;


    @PostMapping("/addRoute")
    public Route addRoute(@RequestBody Route route) {
        return routeService.addRoute(route);
    }

    @GetMapping("/getAllRoutes")
    public List<Route> getAllRoutes() {
        return routeService.getRoutes();
    }

    @PutMapping("/updateRoute")
    public Route updateRoute(@RequestBody Route route) {
        return routeService.updateRoute(route);
    }


    @GetMapping("/getRouteById/{id}")
    public Route getRoute(@PathVariable Long id) {
        return routeService.getRoute(id);
    }

    @DeleteMapping("/deleteRoute/{id}")
    public void deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
    }

    @PostMapping("/addStudentPickup/{routeId}")
    public ResponseEntity<String> addStudentPickup(@PathVariable Long routeId,
                                                   @RequestParam double latitude,
                                                   @RequestParam double longitude,
                                                   @RequestParam String studentEmail) {
        String result = routeService.addStudentPickup(routeId, latitude, longitude, studentEmail);
        return ResponseEntity.ok(result);
    }


}