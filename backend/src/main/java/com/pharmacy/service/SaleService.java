package com.pharmacy.service;

import com.pharmacy.dto.SaleRequest;
import com.pharmacy.dto.SaleResponse;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.Sale;
import com.pharmacy.model.User;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {
    
    private final SaleRepository saleRepository;
    private final MedicineRepository medicineRepository;
    private final UserService userService;
    
    @Transactional
    public SaleResponse createSale(SaleRequest request) {
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        if (medicine.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + medicine.getQuantity());
        }
        
        // Get current user email from security context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        
        // Calculate total amount and profit
        BigDecimal totalAmount = medicine.getSellingPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        BigDecimal costAmount = medicine.getCostPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        BigDecimal profit = totalAmount.subtract(costAmount);
        
        // Create sale
        Sale sale = new Sale();
        sale.setMedicine(medicine);
        sale.setUser(user);
        sale.setQuantity(request.getQuantity());
        sale.setTotalAmount(totalAmount);
        sale.setProfit(profit);
        sale.setSaleDate(LocalDateTime.now());
        
        Sale savedSale = saleRepository.save(sale);
        
        // Update medicine stock
        medicine.setQuantity(medicine.getQuantity() - request.getQuantity());
        medicineRepository.save(medicine);
        
        return convertToResponse(savedSale);
    }
    
    public List<SaleResponse> getAllSales() {
        return saleRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<SaleResponse> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return saleRepository.findBySaleDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public BigDecimal getTotalProfit(LocalDateTime startDate, LocalDateTime endDate) {
        Double profit = saleRepository.sumProfitByDateBetween(startDate, endDate);
        return profit != null ? BigDecimal.valueOf(profit) : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        Double revenue = saleRepository.sumTotalAmountByDateBetween(startDate, endDate);
        return revenue != null ? BigDecimal.valueOf(revenue) : BigDecimal.ZERO;
    }
    
    private SaleResponse convertToResponse(Sale sale) {
        SaleResponse response = new SaleResponse();
        response.setSaleId(sale.getSaleId());
        response.setMedicineName(sale.getMedicine().getName());
        response.setQuantity(sale.getQuantity());
        response.setTotalAmount(sale.getTotalAmount());
        response.setProfit(sale.getProfit());
        response.setSaleDate(sale.getSaleDate());
        response.setUserName(sale.getUser().getName());
        return response;
    }
}
