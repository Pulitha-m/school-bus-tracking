package com.BusTracking.backend.Service;//package com.Safetrack.back.Service;
//
//import com.Safetrack.back.Model.User;
//import com.Safetrack.back.Repository.UserRepo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Component;
//import jakarta.annotation.PostConstruct;
//
//import static com.Safetrack.back.Enums.ROLE.ADMIN;
//
//@Component
//public class AdminSetupService {
//
//    @Autowired
//    private UserRepo userRepo;
//
//    @PostConstruct
//    public void createAdminUser() {
//        if (userRepo.findByRole(ADMIN).isEmpty()) { // Ensure admin isn't duplicated
//            System.out.println("🛠 Creating default Admin user...");
//
//            User admin = new User();
//            admin.setUsername("admin@safetrack.com");
//            admin.setPassword(new BCryptPasswordEncoder().encode("Admin@123")); // Securely hash password
//            admin.setRole(ADMIN);
//
//            userRepo.save(admin);
//            System.out.println("✅ Default Admin user created successfully!");
//        } else {
//            System.out.println("✅ Admin user already exists. Skipping creation.");
//        }
//    }
//}
