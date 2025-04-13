package com.BusTracking.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleDistanceService {

    @Value("${google.maps.api.key}") // Read API key from application.properties
    private String googleApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getDistance(String origins, String destinations) {
        String url = "https://routes.googleapis.com/directions/v2:computeRoutes";

        // Construct the JSON request body for Google Routes API
        String requestBody = "{"
                + "\"origin\": {\"location\": {\"latLng\": {\"latitude\": " + parseLatitude(origins) + ", \"longitude\": " + parseLongitude(origins) + "}}},"
                + "\"destination\": {\"location\": {\"latLng\": {\"latitude\": " + parseLatitude(destinations) + ", \"longitude\": " + parseLongitude(destinations) + "}}},"
                + "\"travelMode\": \"DRIVE\","
                + "\"routingPreference\": \"TRAFFIC_AWARE\","
                + "\"computeAlternativeRoutes\": false,"
                + "\"languageCode\": \"en-US\","
                + "\"units\": \"METRIC\""
                + "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Goog-Api-Key", googleApiKey); // Pass API Key in the header
        headers.set("X-Goog-FieldMask", "routes.distanceMeters"); // Only request necessary data

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }

    public String getRouteWithWaypoints(String origin, String destination, List<String> waypoints) {
        String url = "https://routes.googleapis.com/directions/v2:computeRoutes";

        // Log input coordinates for debugging
        System.out.println("Origin: " + origin);
        System.out.println("Destination: " + destination);
        System.out.println("Waypoints: " + waypoints);

        // Pair latitude and longitude values into "lat,lng" strings
        List<String> pairedWaypoints = new ArrayList<>();
        for (int i = 0; i < waypoints.size(); i += 2) {
            String lat = waypoints.get(i);
            String lng = waypoints.get(i + 1);
            pairedWaypoints.add(lat + "," + lng);
        }

        // Construct the JSON request body for Google Routes API
        StringBuilder requestBody = new StringBuilder();
        requestBody.append("{")
                .append("\"origin\": {\"location\": {\"latLng\": {\"latitude\": ").append(parseLatitude(origin)).append(", \"longitude\": ").append(parseLongitude(origin)).append("}}},")
                .append("\"destination\": {\"location\": {\"latLng\": {\"latitude\": ").append(parseLatitude(destination)).append(", \"longitude\": ").append(parseLongitude(destination)).append("}}},")
                .append("\"intermediates\": [");

        // Add paired waypoints as intermediates
        for (int i = 0; i < pairedWaypoints.size(); i++) {
            String waypoint = pairedWaypoints.get(i);
            requestBody.append("{\"location\": {\"latLng\": {\"latitude\": ").append(parseLatitude(waypoint)).append(", \"longitude\": ").append(parseLongitude(waypoint)).append("}}}");
            if (i < pairedWaypoints.size() - 1) {
                requestBody.append(",");
            }
        }

        requestBody.append("],")
                .append("\"travelMode\": \"DRIVE\",")
                .append("\"routingPreference\": \"TRAFFIC_AWARE\",")
                .append("\"computeAlternativeRoutes\": false,")
                .append("\"languageCode\": \"en-US\",")
                .append("\"units\": \"METRIC\"")
                .append("}");

        // Log the request body for debugging
        System.out.println("Request Body: " + requestBody.toString());

        // Set headers for API request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Goog-Api-Key", googleApiKey); // Pass API Key in the header
        headers.set("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.legs,routes.polyline.encodedPolyline"); // Request specific fields

        // Send the request
        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // Log the response status and body
        System.out.println("Response Status: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        // Return the response body (contains the route information)
        return response.getBody();
    }

    // Helper method to parse latitude from "lat,lng" format
    private String parseLatitude(String coordinates) {
        if (coordinates == null || !coordinates.contains(",")) {
            throw new IllegalArgumentException("Invalid coordinates format: " + coordinates + ". Expected format: 'lat,lng'.");
        }
        return coordinates.split(",")[0].trim(); // Extracts latitude from "lat,lng"
    }

    // Helper method to parse longitude from "lat,lng" format
    private String parseLongitude(String coordinates) {
        if (coordinates == null || !coordinates.contains(",")) {
            throw new IllegalArgumentException("Invalid coordinates format: " + coordinates + ". Expected format: 'lat,lng'.");
        }
        return coordinates.split(",")[1].trim(); // Extracts longitude from "lat,lng"
    }

    public String getSimpleRoute(String origin, String destination) {
        String url = "https://routes.googleapis.com/directions/v2:computeRoutes";

        // Construct the JSON request body for Google Routes API
        String requestBody = "{"
                + "\"origin\": {\"location\": {\"latLng\": {\"latitude\": " + parseLatitude(origin) + ", \"longitude\": " + parseLongitude(origin) + "}}},"
                + "\"destination\": {\"location\": {\"latLng\": {\"latitude\": " + parseLatitude(destination) + ", \"longitude\": " + parseLongitude(destination) + "}}},"
                + "\"travelMode\": \"DRIVE\","
                + "\"routingPreference\": \"TRAFFIC_AWARE\","
                + "\"computeAlternativeRoutes\": false,"
                + "\"languageCode\": \"en-US\","
                + "\"units\": \"METRIC\""
                + "}";

        // Set headers for API request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Goog-Api-Key", googleApiKey); // Pass API Key in the header
        headers.set("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"); // Request specific fields

        // Send the request
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // Log the response status and body
        System.out.println("Response Status: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        // Return the response body (contains the route information)
        return response.getBody();
    }


//    // Helper method to parse latitude from "lat,lng" format
//    private String parseLatitude(String coordinates) {
//        if (coordinates == null || !coordinates.contains(",")) {
//            throw new IllegalArgumentException("Invalid coordinates format: " + coordinates + ". Expected format: 'lat,lng'.");
//        }
//        return coordinates.split(",")[0].trim(); // Extracts latitude from "lat,lng"
//    }
//
//    private String parseLongitude(String coordinates) {
//        if (coordinates == null || !coordinates.contains(",")) {
//            throw new IllegalArgumentException("Invalid coordinates format: " + coordinates + ". Expected format: 'lat,lng'.");
//        }
//        return coordinates.split(",")[1].trim(); // Extracts longitude from "lat,lng"
//    }


}