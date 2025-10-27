package com.pharmacy.config;

import com.pharmacy.model.User;
import com.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Initializing default users...");
            
            // Create Admin user
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@pharmacy.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.UserRole.ADMIN);
            userRepository.save(admin);
            
            // Create Pharmacist user
            User pharmacist = new User();
            pharmacist.setName("Pharmacist User");
            pharmacist.setEmail("pharmacist@pharmacy.com");
            pharmacist.setPassword(passwordEncoder.encode("pharma123"));
            pharmacist.setRole(User.UserRole.PHARMACIST);
            userRepository.save(pharmacist);
            
            // Create Cashier user
            User cashier = new User();
            cashier.setName("Cashier User");
            cashier.setEmail("cashier@pharmacy.com");
            cashier.setPassword(passwordEncoder.encode("cashier123"));
            cashier.setRole(User.UserRole.CASHIER);
            userRepository.save(cashier);
            
            log.info("Default users initialized successfully");
        }
    }
}
