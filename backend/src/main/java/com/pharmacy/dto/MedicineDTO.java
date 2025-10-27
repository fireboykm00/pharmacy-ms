package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
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
}
