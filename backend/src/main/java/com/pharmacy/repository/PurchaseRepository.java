package com.pharmacy.repository;

import com.pharmacy.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    @Query("SELECT p FROM Purchase p WHERE p.purchaseDate >= :startDate AND p.purchaseDate <= :endDate")
    List<Purchase> findByPurchaseDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
