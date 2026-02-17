package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boxcorner.boxcorner.entity.SalesActivity;

public interface SalesActivityRepository extends JpaRepository<SalesActivity, Long> {

    @Query(value = """
            SELECT * FROM sales_activities s
            WHERE
                (:activityId IS NULL OR s.activity_id = :activityId)
                AND (:customerName IS NULL OR :customerName = '' OR UPPER(s.customer_name) LIKE UPPER(CONCAT('%', :customerName, '%')))
                AND (:contactPerson IS NULL OR :contactPerson = '' OR UPPER(s.contact_person) LIKE UPPER(CONCAT('%', :contactPerson, '%')))
                AND (:isNewCustomer IS NULL OR s.is_new_customer = :isNewCustomer)
                AND (CAST(:startDate AS DATE) IS NULL OR s.activity_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.activity_date <= :endDate)
            ORDER BY s.activity_date DESC, s.activity_id DESC
            """, countQuery = "SELECT count(*) FROM sales_activities s", nativeQuery = true)
    Page<SalesActivity> findByFilters(
            @Param("activityId") Long activityId,
            @Param("customerName") String customerName,
            @Param("contactPerson") String contactPerson,
            @Param("isNewCustomer") Boolean isNewCustomer,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
}
