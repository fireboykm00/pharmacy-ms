package com.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    
    // Getters
    public Long getSaleId() {
        return saleId;
    }
    
    public String getMedicineName() {
        return medicineName;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public BigDecimal getProfit() {
        return profit;
    }
    
    public LocalDateTime getSaleDate() {
        return saleDate;
    }
    
    public String getUserName() {
        return userName;
    }
    
    // Setters
    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }
    
    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public void setProfit(BigDecimal profit) {
        this.profit = profit;
    }
    
    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
}