package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
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
}
