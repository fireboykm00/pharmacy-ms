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
            LocalDateTime start = parseDateTime(startDate);
            LocalDateTime end = parseDateTime(endDate);
            return ResponseEntity.ok(saleService.getSalesByDateRange(start, end));
        } catch (Exception e) {
            System.err.println("Error parsing dates: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<Map<String, BigDecimal>> getSalesSummary(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = parseDateTime(startDate);
            LocalDateTime end = parseDateTime(endDate);
            
            BigDecimal totalProfit = saleService.getTotalProfit(start, end);
            BigDecimal totalRevenue = saleService.getTotalRevenue(start, end);
            
            Map<String, BigDecimal> summary = new HashMap<>();
            summary.put("totalProfit", totalProfit);
            summary.put("totalRevenue", totalRevenue);
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("Error parsing dates: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    private LocalDateTime parseDateTime(String dateTimeStr) {
        try {
            // Try parsing with different formats
            if (dateTimeStr.contains("T") && dateTimeStr.contains("Z")) {
                // Handle ISO format with Z timezone (UTC)
                return java.time.ZonedDateTime.parse(dateTimeStr)
                    .withZoneSameInstant(java.time.ZoneId.systemDefault())
                    .toLocalDateTime();
            } else if (dateTimeStr.contains("T")) {
                // Handle ISO format without timezone
                return LocalDateTime.parse(dateTimeStr);
            } else {
                // Handle date-only format
                return java.time.LocalDate.parse(dateTimeStr).atStartOfDay();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse date: " + dateTimeStr, e);
        }
    }
}
