package com.boxcorner.boxcorner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProductionJob;
import java.time.LocalDate;

@Repository
public interface ProductionJobRepository extends JpaRepository<ProductionJob, Long> {
    
    @Query("SELECT p FROM ProductionJob p WHERE " +
           "(:id IS NULL OR p.id = :id) AND " +
           "(:jobId IS NULL OR p.jobId LIKE %:jobId%) AND " +
           "(:customerJobName IS NULL OR p.customerJobName LIKE %:customerJobName%) AND " +
           "(:printStatus IS NULL OR p.printStatus = :printStatus) AND " +
           "(:startDate IS NULL OR p.date >= :startDate) AND " +
           "(:endDate IS NULL OR p.date <= :endDate)")
    Page<ProductionJob> findByFilters(
        @Param("id") Long id,
        @Param("jobId") String jobId,
        @Param("customerJobName") String customerJobName,
        @Param("printStatus") String printStatus,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
}