package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boxcorner.boxcorner.entity.SampleOrder;

public interface SampleOrderRepository extends JpaRepository<SampleOrder, Integer> {
    
    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.id DESC
            """,
            countQuery = "SELECT count(*) FROM sample_orders s",
            nativeQuery = true)
    Page<SampleOrder> findByFilters(
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

}
