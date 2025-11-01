package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
public class StockReportDTO {
    private Long medicineId;
    private String name;
    private String category;
    private Integer quantity;
    private Integer reorderLevel;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private String status; // LOW, NORMAL, OUT_OF_STOCK
    
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
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public Integer getReorderLevel() {
        return reorderLevel;
    }
    
    public BigDecimal getCostPrice() {
        return costPrice;
    }
    
    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }
    
    public String getStatus() {
        return status;
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
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }
    
    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }
    
    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}