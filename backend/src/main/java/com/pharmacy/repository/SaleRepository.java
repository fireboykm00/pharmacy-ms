package com.pharmacy.repository;

import com.pharmacy.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    
    @Query("SELECT s FROM Sale s WHERE s.saleDate >= :startDate AND s.saleDate <= :endDate")
    List<Sale> findBySaleDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate >= :startDate AND s.saleDate <= :endDate")
    Long countBySaleDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.saleDate >= :startDate AND s.saleDate <= :endDate")
    Double sumTotalAmountByDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(s.profit) FROM Sale s WHERE s.saleDate >= :startDate AND s.saleDate <= :endDate")
    Double sumProfitByDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
