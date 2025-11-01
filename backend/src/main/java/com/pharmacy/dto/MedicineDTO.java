package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
public class MedicineDTO {
    private Long medicineId;
    
    private String name;
    
    private String category;
    
    private BigDecimal costPrice;
    
    private BigDecimal sellingPrice;
    
    private Integer quantity;
    
    private LocalDate expiryDate;
    
    private Integer reorderLevel;
    
    private Long supplierId;
    
    private String supplierName;
    
    // Getters
    public Long getMedicineId() {
        return medicineId;
    }
    
    public String getName() {
        return name;
    }
    
    public String getCategory() {
        return category;
    }
    
    public BigDecimal getCostPrice() {
        return costPrice;
    }
    
    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public Integer getReorderLevel() {
        return reorderLevel;
    }
    
    public Long getSupplierId() {
        return supplierId;
    }
    
    public String getSupplierName() {
        return supplierName;
    }
    
    // Setters
    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }
    
    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }
    
    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
    
    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }
}