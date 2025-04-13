package com.BusTracking.backend.Controller;




import com.Safetrack.back.Model.GpsData;
import com.Safetrack.back.Repository.GpsDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gps")
@CrossOrigin(origins = "*")
public class GpsDataController {

    @Autowired
    private GpsDataRepository repository;

    @PostMapping("/log")
    public GpsData saveData(@RequestBody GpsData data) {
        System.out.println(data.getLatitude()+", "+data.getLongitude());
        return repository.save(data);
    }

    @GetMapping("/all")
    public List<GpsData> getAll() {
        return repository.findAll();
    }

    @GetMapping("/getLatest")
    public GpsData getLatest() {
        return repository.findTopByOrderByIdDesc();
    }
}
