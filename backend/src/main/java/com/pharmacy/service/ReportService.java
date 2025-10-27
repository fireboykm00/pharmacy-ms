package com.pharmacy.service;

import com.pharmacy.dto.StockReportDTO;
import com.pharmacy.model.Medicine;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    
    private final MedicineService medicineService;
    
    public List<StockReportDTO> getStockReport() {
        return medicineService.getAllMedicines().stream()
                .map(medicine -> {
                    StockReportDTO report = new StockReportDTO();
                    report.setMedicineId(medicine.getMedicineId());
                    report.setName(medicine.getName());
                    report.setCategory(medicine.getCategory());
                    report.setQuantity(medicine.getQuantity());
                    report.setReorderLevel(medicine.getReorderLevel());
                    report.setCostPrice(medicine.getCostPrice());
                    report.setSellingPrice(medicine.getSellingPrice());
                    
                    if (medicine.getQuantity() == 0) {
                        report.setStatus("OUT_OF_STOCK");
                    } else if (medicine.getQuantity() <= medicine.getReorderLevel()) {
                        report.setStatus("LOW");
                    } else {
                        report.setStatus("NORMAL");
                    }
                    
                    return report;
                })
                .collect(Collectors.toList());
    }
    
    public List<Medicine> getExpiryReport() {
        return medicineService.getExpiredMedicines();
    }
    
    public List<Medicine> getExpiringMedicines(int days) {
        LocalDate futureDate = LocalDate.now().plusDays(days);
        return medicineService.getAllMedicines().stream()
                .map(dto -> {
                    Medicine medicine = new Medicine();
                    medicine.setMedicineId(dto.getMedicineId());
                    medicine.setName(dto.getName());
                    medicine.setExpiryDate(dto.getExpiryDate());
                    return medicine;
                })
                .filter(m -> m.getExpiryDate().isBefore(futureDate) && m.getExpiryDate().isAfter(LocalDate.now()))
                .collect(Collectors.toList());
    }
    
    @Scheduled(fixedRate = 86400000) // Run daily
    public void checkExpiryDates() {
        List<Medicine> expiredMedicines = medicineService.getExpiredMedicines();
        List<Medicine> expiringMedicines = getExpiringMedicines(30);
        
        if (!expiredMedicines.isEmpty()) {
            logger.warn("Found {} expired medicines", expiredMedicines.size());
            expiredMedicines.forEach(m -> 
                logger.warn("Expired: {} - Expiry Date: {}", m.getName(), m.getExpiryDate())
            );
        }
        
        if (!expiringMedicines.isEmpty()) {
            logger.info("Found {} medicines expiring in next 30 days", expiringMedicines.size());
        }
    }
    
    @Scheduled(fixedRate = 86400000) // Run daily
    public void checkLowStock() {
        List<Medicine> lowStockMedicines = medicineService.getLowStockMedicines();
        
        if (!lowStockMedicines.isEmpty()) {
            logger.warn("Found {} medicines with low stock", lowStockMedicines.size());
            lowStockMedicines.forEach(m -> 
                logger.warn("Low Stock: {} - Current: {}, Reorder Level: {}", 
                    m.getName(), m.getQuantity(), m.getReorderLevel())
            );
        }
    }
}
