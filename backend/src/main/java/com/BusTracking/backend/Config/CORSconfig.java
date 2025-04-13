package com.BusTracking.backend.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSconfig implements WebMvcConfigurer {


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // This allows all origins, all methods, and all headers
        registry.addMapping("/**") // Apply to all endpoints
                .allowedOrigins("http://localhost:5173", "https://607e-2402-d000-813c-1628-dd5b-b31d-b16b-4aba.ngrok-free.app","http://192.168.56.1:5173") // Specify allowed origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Specify allowed HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials (cookies, authorization headers)
    }
}
