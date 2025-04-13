package com.BusTracking.backend.Model;


import com.BusTracking.backend.Enums.busStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long busId;
    private String model;
    private String make;
    private String noPlate;
    private int capacity;

    @Enumerated(EnumType.STRING)
    private busStatus status;

    private int driverId;
    private int routeId;
    private double current_latitude;
    private double current_longitude;
    private boolean isDriverAssigned = false;

    @Lob
    @Column(name = "bus_image", columnDefinition = "LONGBLOB")
    private byte[] busImage;

    @Transient
    private String imageBase64;

    public long getBusId() {
        return busId;
    }

    public void setBusId(long busId) {
        this.busId = busId;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getNoPlate() {
        return noPlate;
    }

    public void setNoPlate(String noPlate) {
        this.noPlate = noPlate;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public busStatus getStatus() {
        return status;
    }

    public void setStatus(busStatus status) {
        this.status = status;
    }

    public int getDriverId() {
        return driverId;
    }

    public void setDriverId(int driverId) {
        this.driverId = driverId;
    }

    public int getRouteId() {
        return routeId;
    }

    public void setRouteId(int routeId) {
        this.routeId = routeId;
    }

    public double getCurrent_latitude() {
        return current_latitude;
    }

    public void setCurrent_latitude(double current_latitude) {
        this.current_latitude = current_latitude;
    }

    public double getCurrent_longitude() {
        return current_longitude;
    }

    public void setCurrent_longitude(double current_longitude) {
        this.current_longitude = current_longitude;
    }

    public byte[] getBusImage() {
        return busImage;
    }

    public void setBusImage(byte[] busImage) {
        this.busImage = busImage;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public boolean isDriverAssigned() {
        return isDriverAssigned;
    }

    public void setDriverAssigned(boolean driverAssigned) {
        isDriverAssigned = driverAssigned;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }
}
