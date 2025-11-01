package com.pharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "suppliers")
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String contact;
    
    @Column(nullable = true)
    private String email;
    
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Medicine> medicines = new ArrayList<>();
    
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Purchase> purchases = new ArrayList<>();
    
    // Getters
    public Long getSupplierId() {
        return supplierId;
    }
    
    public String getName() {
        return name;
    }
    
    public String getContact() {
        return contact;
    }
    
    public String getEmail() {
        return email;
    }
    
    public List<Medicine> getMedicines() {
        return medicines;
    }
    
    public List<Purchase> getPurchases() {
        return purchases;
    }
    
    // Setters
    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setContact(String contact) {
        this.contact = contact;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setMedicines(List<Medicine> medicines) {
        this.medicines = medicines;
    }
    
    public void setPurchases(List<Purchase> purchases) {
        this.purchases = purchases;
    }
    
    // equals and hashCode based on ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supplier supplier = (Supplier) o;
        return Objects.equals(supplierId, supplier.supplierId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(supplierId);
    }
    
    // toString excluding relationships
    @Override
    public String toString() {
        return "Supplier{" +
                "supplierId=" + supplierId +
                ", name='" + name + '\'' +
                ", contact='" + contact + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}