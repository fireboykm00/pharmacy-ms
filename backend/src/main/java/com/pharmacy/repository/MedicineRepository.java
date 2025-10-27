package com.pharmacy.repository;

import com.pharmacy.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByExpiryDateBefore(LocalDate date);
    
    @Query("SELECT m FROM Medicine m WHERE m.quantity <= m.reorderLevel")
    List<Medicine> findLowStockMedicines();
    
    @Query("SELECT m FROM Medicine m WHERE m.expiryDate <= :date")
    List<Medicine> findMedicinesExpiringBefore(@Param("date") LocalDate date);
}
