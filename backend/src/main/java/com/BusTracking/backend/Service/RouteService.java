package com.BusTracking.backend.Service;

import com.BusTracking.backend.Model.Route;
import com.BusTracking.backend.Model.StudentPickup;
import com.BusTracking.backend.Repository.RouteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteService {


    @Autowired
    private RouteRepo routeRepo;

    public List<Route> getRoutes() {
        return routeRepo.findAll();
    }

    public Route getRoute(Long id) {
        return routeRepo.findById(id).get();
    }

    public Route addRoute(Route route) {
        return routeRepo.save(route);
    }

    public Route updateRoute(Route route) {
        return routeRepo.save(route);
    }

    public String deleteRoute(Long id) {

        if (routeRepo.existsById(id)) {
            routeRepo.deleteById(id);
            return "Route deleted";
        }else {
            return "Route not found";
        }
    }

    public String addStudentPickup(Long routeId, double latitude, double longitude, String studentEmail) {
        Optional<Route> routeOptional = routeRepo.findById(routeId);

        if (routeOptional.isPresent()) {
            Route route = routeOptional.get();

            // Create new StudentPickup object
            StudentPickup newPickup = new StudentPickup();
            newPickup.setLatitude(latitude);
            newPickup.setLongitude(longitude);
            newPickup.setStudentEmail(studentEmail);

            // Add to route's studentPickups list
            route.getStudentPickups().add(newPickup);

            // Save the updated route
            routeRepo.save(route);
            return "Student pickup location added successfully.";
        }
        return "Route not found.";
    }
}