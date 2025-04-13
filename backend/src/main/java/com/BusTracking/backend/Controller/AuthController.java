package com.BusTracking.backend.Controller;


import com.BusTracking.backend.Model.User;
import com.BusTracking.backend.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public User login(@RequestBody User user, HttpSession session) {
        return authService.loginUserLocal(user, session);
    }


    @PostMapping("/logout")
    public String logout(HttpSession session) {
        return authService.logoutUser(session);
    }


    @GetMapping("/session")
    public Object getSessionUser(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return "No active session";
        }
        return user;
}
}