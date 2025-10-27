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
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(purchaseService.getPurchasesByDateRange(startDate, endDate));
    }
}
