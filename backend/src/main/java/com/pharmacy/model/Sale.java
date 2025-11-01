package com.pharmacy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "sales")
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private Long saleId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal profit;
    
    @Column(nullable = false)
    private LocalDateTime saleDate;
    
    // Getters
    public Long getSaleId() {
        return saleId;
    }
    
    public Medicine getMedicine() {
        return medicine;
    }
    
    public User getUser() {
        return user;
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
    
    // Setters
    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }
    
    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    // equals and hashCode based on ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Sale sale = (Sale) o;
        return Objects.equals(saleId, sale.saleId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(saleId);
    }
    
    // toString
    @Override
    public String toString() {
        return "Sale{" +
                "saleId=" + saleId +
                ", medicine=" + medicine +
                ", user=" + user +
                ", quantity=" + quantity +
                ", totalAmount=" + totalAmount +
                ", profit=" + profit +
                ", saleDate=" + saleDate +
                '}';
    }
}