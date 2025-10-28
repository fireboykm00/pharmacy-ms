package com.pharmacy.config;

import com.pharmacy.model.*;
import com.pharmacy.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;
    private final PurchaseRepository purchaseRepository;
    private final SaleRepository saleRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize Users
        if (userRepository.count() == 0) {
            log.info("Initializing users...");
            initializeUsers();
            log.info("Users initialized successfully");
        }
        
        // Initialize Suppliers
        if (supplierRepository.count() == 0) {
            log.info("Initializing suppliers...");
            initializeSuppliers();
            log.info("Suppliers initialized successfully");
        }
        
        // Initialize Medicines
        if (medicineRepository.count() == 0) {
            log.info("Initializing medicines...");
            initializeMedicines();
            log.info("Medicines initialized successfully");
        }
        
        // Initialize Purchases
        if (purchaseRepository.count() == 0) {
            log.info("Initializing purchases...");
            initializePurchases();
            log.info("Purchases initialized successfully");
        }
        
        // Initialize Sales
        if (saleRepository.count() == 0) {
            log.info("Initializing sales...");
            initializeSales();
            log.info("Sales initialized successfully");
        }
        
        log.info("Data initialization completed!");
    }
    
    private void initializeUsers() {
        // Admin user
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@pharmacy.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.UserRole.ADMIN);
        userRepository.save(admin);
        
        // Pharmacist user
        User pharmacist = new User();
        pharmacist.setName("Pharmacist User");
        pharmacist.setEmail("pharmacist@pharmacy.com");
        pharmacist.setPassword(passwordEncoder.encode("pharma123"));
        pharmacist.setRole(User.UserRole.PHARMACIST);
        userRepository.save(pharmacist);
        
        // Cashier user
        User cashier = new User();
        cashier.setName("Cashier User");
        cashier.setEmail("cashier@pharmacy.com");
        cashier.setPassword(passwordEncoder.encode("cashier123"));
        cashier.setRole(User.UserRole.CASHIER);
        userRepository.save(cashier);
        
        // Additional users
        User pharmacist2 = new User();
        pharmacist2.setName("Dr. John Doe");
        pharmacist2.setEmail("john@pharmacy.com");
        pharmacist2.setPassword(passwordEncoder.encode("password123"));
        pharmacist2.setRole(User.UserRole.PHARMACIST);
        userRepository.save(pharmacist2);
        
        User cashier2 = new User();
        cashier2.setName("Jane Smith");
        cashier2.setEmail("jane@pharmacy.com");
        cashier2.setPassword(passwordEncoder.encode("password123"));
        cashier2.setRole(User.UserRole.CASHIER);
        userRepository.save(cashier2);
    }
    
    private void initializeSuppliers() {
        Supplier supplier1 = new Supplier();
        supplier1.setName("MediPharma Inc.");
        supplier1.setContact("+1-234-567-8900");
        supplier1.setEmail("contact@medipharma.com");
        supplierRepository.save(supplier1);
        
        Supplier supplier2 = new Supplier();
        supplier2.setName("HealthCare Supplies Ltd.");
        supplier2.setContact("+1-234-567-8901");
        supplier2.setEmail("info@healthcaresupplies.com");
        supplierRepository.save(supplier2);
        
        Supplier supplier3 = new Supplier();
        supplier3.setName("Global Pharma Solutions");
        supplier3.setContact("+1-234-567-8902");
        supplier3.setEmail("sales@globalpharma.com");
        supplierRepository.save(supplier3);
        
        Supplier supplier4 = new Supplier();
        supplier4.setName("QuickMed Distributors");
        supplier4.setContact("+1-234-567-8903");
        supplier4.setEmail("orders@quickmed.com");
        supplierRepository.save(supplier4);
        
        Supplier supplier5 = new Supplier();
        supplier5.setName("BioHealth Pharmaceuticals");
        supplier5.setContact("+1-234-567-8904");
        supplier5.setEmail("support@biohealth.com");
        supplierRepository.save(supplier5);
    }
    
    private void initializeMedicines() {
        Supplier s1 = supplierRepository.findById(1L).orElseThrow();
        Supplier s2 = supplierRepository.findById(2L).orElseThrow();
        Supplier s3 = supplierRepository.findById(3L).orElseThrow();
        Supplier s4 = supplierRepository.findById(4L).orElseThrow();
        Supplier s5 = supplierRepository.findById(5L).orElseThrow();
        
        // Pain Relief
        createMedicine("Paracetamol 500mg", "Pain Relief", 5.00, 8.50, 500, 2, 100, s1);
        createMedicine("Ibuprofen 400mg", "Pain Relief", 6.50, 10.00, 400, 2, 80, s1);
        createMedicine("Aspirin 100mg", "Pain Relief", 3.50, 6.00, 600, 3, 120, s3);
        
        // Antibiotics
        createMedicine("Amoxicillin 500mg", "Antibiotic", 12.00, 18.00, 300, 1, 60, s2);
        createMedicine("Azithromycin 250mg", "Antibiotic", 15.00, 22.50, 250, 1, 50, s2);
        createMedicine("Ciprofloxacin 500mg", "Antibiotic", 10.00, 15.50, 220, 2, 45, s2);
        
        // Cardiovascular
        createMedicine("Atorvastatin 20mg", "Cardiovascular", 18.00, 27.00, 200, 2, 40, s3);
        createMedicine("Lisinopril 10mg", "Cardiovascular", 8.00, 13.00, 280, 2, 55, s3);
        
        // Diabetes
        createMedicine("Metformin 500mg", "Diabetes", 8.00, 12.50, 350, 2, 70, s4);
        createMedicine("Insulin Glargine 100 units/ml", "Diabetes", 45.00, 65.00, 100, 1, 20, s4);
        
        // Respiratory
        createMedicine("Cetirizine 10mg", "Respiratory", 4.50, 7.50, 450, 2, 90, s5);
        createMedicine("Salbutamol Inhaler", "Respiratory", 25.00, 38.00, 150, 2, 30, s5);
        createMedicine("Montelukast 10mg", "Respiratory", 12.00, 18.50, 180, 2, 35, s5);
        
        // Gastrointestinal
        createMedicine("Omeprazole 20mg", "Gastrointestinal", 7.00, 11.00, 380, 2, 75, s1);
        createMedicine("Loperamide 2mg", "Gastrointestinal", 3.00, 5.50, 280, 3, 55, s2);
        
        // Vitamins
        createMedicine("Vitamin C 1000mg", "Vitamins", 5.50, 9.00, 550, 2, 110, s3);
        createMedicine("Vitamin D3 5000 IU", "Vitamins", 8.50, 13.50, 320, 2, 65, s4);
        createMedicine("Multivitamin Complex", "Vitamins", 10.00, 16.00, 400, 2, 80, s5);
        createMedicine("Calcium + Vitamin D", "Vitamins", 9.00, 14.00, 290, 2, 60, s3);
        
        // Additional medicines
        createMedicine("Diclofenac 50mg", "Pain Relief", 7.00, 11.50, 330, 2, 65, s1);
    }
    
    private void createMedicine(String name, String category, double costPrice, 
                                double sellingPrice, int quantity, int yearsUntilExpiry, 
                                int reorderLevel, Supplier supplier) {
        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setCategory(category);
        medicine.setCostPrice(new BigDecimal(costPrice));
        medicine.setSellingPrice(new BigDecimal(sellingPrice));
        medicine.setQuantity(quantity);
        medicine.setExpiryDate(LocalDate.now().plusYears(yearsUntilExpiry));
        medicine.setReorderLevel(reorderLevel);
        medicine.setSupplier(supplier);
        medicineRepository.save(medicine);
    }
    
    private void initializePurchases() {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        LocalDateTime twoMonthsAgo = LocalDateTime.now().minusMonths(2);
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
        
        // Create 15 purchase records
        createPurchase(1L, 200, 1000.00, threeMonthsAgo);
        createPurchase(2L, 150, 975.00, threeMonthsAgo.plusDays(2));
        createPurchase(3L, 100, 1200.00, threeMonthsAgo.plusDays(5));
        createPurchase(4L, 120, 1800.00, threeMonthsAgo.plusDays(7));
        createPurchase(5L, 200, 700.00, twoMonthsAgo);
        createPurchase(6L, 80, 3600.00, twoMonthsAgo.plusDays(3));
        createPurchase(7L, 150, 2700.00, twoMonthsAgo.plusDays(8));
        createPurchase(8L, 100, 4500.00, twoMonthsAgo.plusDays(12));
        createPurchase(9L, 150, 1200.00, oneMonthAgo);
        createPurchase(10L, 200, 1100.00, oneMonthAgo.plusDays(4));
        createPurchase(11L, 180, 810.00, oneMonthAgo.plusDays(7));
        createPurchase(12L, 70, 1750.00, oneMonthAgo.plusDays(10));
        createPurchase(13L, 250, 1125.00, twoWeeksAgo);
        createPurchase(14L, 120, 1020.00, twoWeeksAgo.plusDays(3));
        createPurchase(15L, 150, 1500.00, twoWeeksAgo.plusDays(5));
    }
    
    private void createPurchase(Long medicineId, int quantity, double totalCost, LocalDateTime purchaseDate) {
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow();
        Purchase purchase = new Purchase();
        purchase.setMedicine(medicine);
        purchase.setSupplier(medicine.getSupplier());
        purchase.setQuantity(quantity);
        purchase.setTotalCost(new BigDecimal(totalCost));
        purchase.setPurchaseDate(purchaseDate);
        purchaseRepository.save(purchase);
    }
    
    private void initializeSales() {
        User cashier1 = userRepository.findById(3L).orElseThrow();
        User cashier2 = userRepository.findById(5L).orElseThrow();
        User pharmacist = userRepository.findById(2L).orElseThrow();
        
        LocalDateTime lastMonth = LocalDateTime.now().minusMonths(1);
        LocalDateTime lastWeek = LocalDateTime.now().minusWeeks(1);
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime today = LocalDateTime.now();
        
        // Create 20 sale records
        createSale(1L, cashier1, 10, lastMonth);
        createSale(2L, cashier2, 8, lastMonth.plusDays(1));
        createSale(3L, pharmacist, 15, lastMonth.plusDays(2));
        createSale(5L, cashier1, 20, lastMonth.plusDays(3));
        createSale(7L, cashier2, 12, lastMonth.plusDays(5));
        createSale(9L, pharmacist, 18, lastMonth.plusDays(7));
        createSale(11L, cashier1, 14, lastWeek);
        createSale(13L, cashier2, 25, lastWeek.plusDays(1));
        createSale(15L, cashier1, 16, lastWeek.plusDays(2));
        createSale(1L, cashier2, 5, lastWeek.plusDays(3));
        createSale(4L, pharmacist, 10, lastWeek.plusDays(4));
        createSale(6L, cashier1, 8, yesterday);
        createSale(8L, cashier2, 6, yesterday.plusHours(3));
        createSale(10L, pharmacist, 12, yesterday.plusHours(5));
        createSale(12L, cashier1, 7, yesterday.plusHours(7));
        createSale(14L, cashier2, 9, today.minusHours(8));
        createSale(16L, cashier1, 11, today.minusHours(6));
        createSale(18L, cashier2, 13, today.minusHours(4));
        createSale(2L, pharmacist, 6, today.minusHours(2));
        createSale(19L, cashier1, 15, today.minusHours(1));
    }
    
    private void createSale(Long medicineId, User user, int quantity, LocalDateTime saleDate) {
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow();
        
        double totalAmount = medicine.getSellingPrice().doubleValue() * quantity;
        double totalCost = medicine.getCostPrice().doubleValue() * quantity;
        double profit = totalAmount - totalCost;
        
        Sale sale = new Sale();
        sale.setMedicine(medicine);
        sale.setUser(user);
        sale.setQuantity(quantity);
        sale.setTotalAmount(new BigDecimal(totalAmount));
        sale.setProfit(new BigDecimal(profit));
        sale.setSaleDate(saleDate);
        saleRepository.save(sale);
    }
}
