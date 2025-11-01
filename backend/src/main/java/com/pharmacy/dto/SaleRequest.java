package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class SaleRequest {
    private Long medicineId;
    
    private Integer quantity;
    
    // Getters
    public Long getMedicineId() {
        return medicineId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    // Setters
    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}