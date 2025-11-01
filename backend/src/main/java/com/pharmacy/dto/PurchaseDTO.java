package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDTO {
    private Long purchaseId;
    
    private Long medicineId;
    
    private Long supplierId;
    
    private Integer quantity;
    
    private BigDecimal totalCost;
    
    private LocalDateTime purchaseDate;
    
    private String medicineName;
    private String supplierName;
    
    // Getters
    public Long getPurchaseId() {
        return purchaseId;
    }
    
    public Long getMedicineId() {
        return medicineId;
    }
    
    public Long getSupplierId() {
        return supplierId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public BigDecimal getTotalCost() {
        return totalCost;
    }
    
    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }
    
    public String getMedicineName() {
        return medicineName;
    }
    
    public String getSupplierName() {
        return supplierName;
    }
    
    // Setters
    public void setPurchaseId(Long purchaseId) {
        this.purchaseId = purchaseId;
    }
    
    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }
    
    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }
    
    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    
    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }
    
    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }
}