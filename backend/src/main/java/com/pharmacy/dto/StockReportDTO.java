package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
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
}
