package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleResponse {
    private Long saleId;
    private String medicineName;
    private Integer quantity;
    private BigDecimal totalAmount;
    private BigDecimal profit;
    private LocalDateTime saleDate;
    private String userName;
}
