package com.pharmacy.controller;

import com.pharmacy.dto.StockReportDTO;
import com.pharmacy.model.Medicine;
import com.pharmacy.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReportController {
    
    private final ReportService reportService;
    
    @GetMapping("/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<List<StockReportDTO>> getStockReport() {
        return ResponseEntity.ok(reportService.getStockReport());
    }
    
    @GetMapping("/expiry")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'CASHIER')")
    public ResponseEntity<List<Medicine>> getExpiryReport() {
        return ResponseEntity.ok(reportService.getExpiryReport());
    }
    
    @GetMapping("/expiring")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<List<Medicine>> getExpiringMedicines(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(reportService.getExpiringMedicines(days));
    }
}
