package com.pharmacy.controller;

import com.pharmacy.dto.SaleRequest;
import com.pharmacy.dto.SaleResponse;
import com.pharmacy.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SaleController {
    
    private final SaleService saleService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<List<SaleResponse>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<SaleResponse> createSale(@RequestBody SaleRequest request) {
        return ResponseEntity.ok(saleService.createSale(request));
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<List<SaleResponse>> getSalesByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            return ResponseEntity.ok(saleService.getSalesByDateRange(start, end));
        } catch (Exception e) {
            // Try parsing as date only if ISO parsing fails
            try {
                LocalDateTime start = java.time.LocalDate.parse(startDate).atStartOfDay();
                LocalDateTime end = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
                return ResponseEntity.ok(saleService.getSalesByDateRange(start, end));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().build();
            }
        }
    }
    
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<Map<String, BigDecimal>> getSalesSummary(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            
            BigDecimal totalProfit = saleService.getTotalProfit(start, end);
            BigDecimal totalRevenue = saleService.getTotalRevenue(start, end);
            
            Map<String, BigDecimal> summary = new HashMap<>();
            summary.put("totalProfit", totalProfit);
            summary.put("totalRevenue", totalRevenue);
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            // Try parsing as date only if ISO parsing fails
            try {
                LocalDateTime start = java.time.LocalDate.parse(startDate).atStartOfDay();
                LocalDateTime end = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
                
                BigDecimal totalProfit = saleService.getTotalProfit(start, end);
                BigDecimal totalRevenue = saleService.getTotalRevenue(start, end);
                
                Map<String, BigDecimal> summary = new HashMap<>();
                summary.put("totalProfit", totalProfit);
                summary.put("totalRevenue", totalRevenue);
                
                return ResponseEntity.ok(summary);
            } catch (Exception ex) {
                return ResponseEntity.badRequest().build();
            }
        }
    }
}
