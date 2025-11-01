package com.pharmacy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "purchases")
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_id")
    private Long purchaseId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost;
    
    @Column(nullable = false)
    private LocalDateTime purchaseDate;
    
    // Getters
    public Long getPurchaseId() {
        return purchaseId;
    }
    
    public Medicine getMedicine() {
        return medicine;
    }
    
    public Supplier getSupplier() {
        return supplier;
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
    
    // Setters
    public void setPurchaseId(Long purchaseId) {
        this.purchaseId = purchaseId;
    }
    
    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }
    
    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
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
    
    // equals and hashCode based on ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Purchase purchase = (Purchase) o;
        return Objects.equals(purchaseId, purchase.purchaseId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(purchaseId);
    }
    
    // toString
    @Override
    public String toString() {
        return "Purchase{" +
                "purchaseId=" + purchaseId +
                ", medicine=" + medicine +
                ", supplier=" + supplier +
                ", quantity=" + quantity +
                ", totalCost=" + totalCost +
                ", purchaseDate=" + purchaseDate +
                '}';
    }
}