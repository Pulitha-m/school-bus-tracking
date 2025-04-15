//package com.BusTracking.backend.Config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CORSconfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins(
//                        "http://localhost:5173",
//                        "https://0f68-2402-d000-8130-36d6-65c7-5365-c3e4-3a93.ngrok-free.app",
//                        "https://fd75-2402-d000-8130-36d6-65c7-5365-c3e4-3a93.ngrok-free.app",
//                        "http://192.168.56.1:5173"
//                )
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600); // 1 hour cache
//    }
//}
