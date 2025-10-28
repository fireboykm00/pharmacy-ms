package com.pharmacy.controller;

import com.pharmacy.dto.PurchaseDTO;
import com.pharmacy.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PurchaseController {
    
    private final PurchaseService purchaseService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<List<PurchaseDTO>> getAllPurchases() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<PurchaseDTO> createPurchase(@RequestBody PurchaseDTO purchaseDTO) {
        return ResponseEntity.ok(purchaseService.createPurchase(purchaseDTO));
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<List<PurchaseDTO>> getPurchasesByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = parseDateTime(startDate);
            LocalDateTime end = parseDateTime(endDate);
            return ResponseEntity.ok(purchaseService.getPurchasesByDateRange(start, end));
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
