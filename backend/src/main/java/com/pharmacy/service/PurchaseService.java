package com.pharmacy.service;

import com.pharmacy.dto.PurchaseDTO;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.Purchase;
import com.pharmacy.model.Supplier;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseService {
    
    private final PurchaseRepository purchaseRepository;
    private final MedicineRepository medicineRepository;
    private final SupplierService supplierService;
    
    @Transactional
    public PurchaseDTO createPurchase(PurchaseDTO purchaseDTO) {
        Medicine medicine = medicineRepository.findById(purchaseDTO.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        Supplier supplier = supplierService.getSupplierById(purchaseDTO.getSupplierId());
        
        Purchase purchase = new Purchase();
        purchase.setMedicine(medicine);
        purchase.setSupplier(supplier);
        purchase.setQuantity(purchaseDTO.getQuantity());
        purchase.setTotalCost(purchaseDTO.getTotalCost());
        purchase.setPurchaseDate(purchaseDTO.getPurchaseDate() != null ? 
                purchaseDTO.getPurchaseDate() : LocalDateTime.now());
        
        Purchase savedPurchase = purchaseRepository.save(purchase);
        
        // Update medicine stock
        medicine.setQuantity(medicine.getQuantity() + purchaseDTO.getQuantity());
        medicineRepository.save(medicine);
        
        return convertToDTO(savedPurchase);
    }
    
    public List<PurchaseDTO> getAllPurchases() {
        return purchaseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PurchaseDTO> getPurchasesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return purchaseRepository.findByPurchaseDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private PurchaseDTO convertToDTO(Purchase purchase) {
        PurchaseDTO dto = new PurchaseDTO();
        dto.setPurchaseId(purchase.getPurchaseId());
        dto.setMedicineId(purchase.getMedicine().getMedicineId());
        dto.setMedicineName(purchase.getMedicine().getName());
        dto.setSupplierId(purchase.getSupplier().getSupplierId());
        dto.setSupplierName(purchase.getSupplier().getName());
        dto.setQuantity(purchase.getQuantity());
        dto.setTotalCost(purchase.getTotalCost());
        dto.setPurchaseDate(purchase.getPurchaseDate());
        return dto;
    }
}
