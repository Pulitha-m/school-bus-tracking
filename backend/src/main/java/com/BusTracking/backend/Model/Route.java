package com.BusTracking.backend.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private Long busId;

    private String startName;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
    private String endName;


    @ElementCollection
    private List<Locations> schools;

    @ElementCollection
    private List<StudentPickup> studentPickups;

    // Constructors
    public Route() {}

    public Route(Double startLat, Double startLng, Double endLat, Double endLng, List<Locations> schools, List<StudentPickup> studentPickups) {
        this.startLat = startLat;
        this.startLng = startLng;
        this.endLat = endLat;
        this.endLng = endLng;
        this.schools = schools;
        this.studentPickups = studentPickups;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getStartLat() {
        return startLat;
    }

    public void setStartLat(Double startLat) {
        this.startLat = startLat;
    }

    public Double getStartLng() {
        return startLng;
    }

    public void setStartLng(Double startLng) {
        this.startLng = startLng;
    }

    public Double getEndLat() {
        return endLat;
    }

    public void setEndLat(Double endLat) {
        this.endLat = endLat;
    }

    public Double getEndLng() {
        return endLng;
    }

    public void setEndLng(Double endLng) {
        this.endLng = endLng;
    }

    public List<Locations> getSchools() {
        return schools;
    }

    public void setSchools(List<Locations> schools) {
        this.schools = schools;
    }

    public List<StudentPickup> getStudentPickups() {
        return studentPickups;
    }

    public void setStudentPickups(List<StudentPickup> studentPickups) {
        this.studentPickups = studentPickups;
    }

    public String getStartName() {
        return startName;
    }

    public void setStartName(String startName) {
        this.startName = startName;
    }

    public String getEndName() {
        return endName;
    }

    public void setEndName(String endName) {
        this.endName = endName;
    }
}