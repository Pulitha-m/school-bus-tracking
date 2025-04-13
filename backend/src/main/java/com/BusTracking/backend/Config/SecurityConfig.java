package com.BusTracking.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf.disable())  // Disable CSRF protection for stateless applications (like REST APIs)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173","https://607e-2402-d000-813c-1628-dd5b-b31d-b16b-4aba.ngrok-free.app","http://192.168.56.1:5173"));  // Allow your frontend
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                    corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    corsConfiguration.setAllowCredentials(true);  // Allow credentials (cookies) if needed
                    return corsConfiguration;
                }))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                               // .requestMatchers("/api/gps/**").permitAll()
                               // .requestMatchers("/auth/**")
                        // Allow all requests without authentication
                )
                .formLogin(login -> login.disable())  // Correct way to disable form login
                .httpBasic(basic -> basic.disable());
                  // Default logout handling (optional, can be removed if logout is not needed)

        return httpSecurity.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
