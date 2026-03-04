package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boxcorner.boxcorner.entity.SalesActivity;

public interface SalesActivityRepository extends JpaRepository<SalesActivity, Long> {

        @Query(value = """
                        SELECT s FROM SalesActivity s
                        LEFT JOIN FETCH s.dailyRoute dr
                        WHERE
                            (CAST(:activityId AS long) IS NULL OR s.activityId = :activityId)
                            AND (CAST(:salesName AS string) IS NULL OR :salesName = '' OR UPPER(s.salesName) LIKE UPPER(CONCAT('%', :salesName, '%')))
                            AND (CAST(:customerName AS string) IS NULL OR :customerName = '' OR UPPER(s.customerName) LIKE UPPER(CONCAT('%', :customerName, '%')))
                            AND (CAST(:contactPerson AS string) IS NULL OR :contactPerson = '' OR UPPER(s.contactPerson) LIKE UPPER(CONCAT('%', :contactPerson, '%')))
                            AND (CAST(:isNewCustomer AS boolean) IS NULL OR s.isNewCustomer = :isNewCustomer)
                            AND (CAST(:startDateStart AS timestamp) IS NULL OR s.checkInTime >= :startDateStart)
                            AND (CAST(:endDateNextDay AS timestamp) IS NULL OR s.checkInTime < :endDateNextDay)
                            AND (CAST(:startDateMain AS date) IS NULL OR s.activityDate >= :startDateMain)
                            AND (CAST(:endDateMain AS date) IS NULL OR s.activityDate <= :endDateMain)
                        ORDER BY s.activityDate DESC, s.activityId DESC
                        """, countQuery = "SELECT count(s) FROM SalesActivity s")
        Page<SalesActivity> findByFiltersAdmin(
                        @Param("activityId") Long activityId,
                        @Param("salesName") String salesName,
                        @Param("customerName") String customerName,
                        @Param("contactPerson") String contactPerson,
                        @Param("isNewCustomer") Boolean isNewCustomer,
                        @Param("startDateStart") LocalDateTime startDateStart,
                        @Param("endDateNextDay") LocalDateTime endDateNextDay,
                        @Param("startDateMain") LocalDate startDateMain,
                        @Param("endDateMain") LocalDate endDateMain,
                        Pageable pageable);

        @Query(value = """
                        SELECT s FROM SalesActivity s
                        LEFT JOIN FETCH s.dailyRoute dr
                        WHERE
                            (CAST(:activityId AS long) IS NULL OR s.activityId = :activityId)
                            AND (s.salesName = :salesName)
                            AND (CAST(:customerName AS string) IS NULL OR :customerName = '' OR UPPER(s.customerName) LIKE UPPER(CONCAT('%', :customerName, '%')))
                            AND (CAST(:contactPerson AS string) IS NULL OR :contactPerson = '' OR UPPER(s.contactPerson) LIKE UPPER(CONCAT('%', :contactPerson, '%')))
                            AND (CAST(:isNewCustomer AS boolean) IS NULL OR s.isNewCustomer = :isNewCustomer)
                            AND (CAST(:startDateStart AS timestamp) IS NULL OR s.checkInTime >= :startDateStart)
                            AND (CAST(:endDateNextDay AS timestamp) IS NULL OR s.checkInTime < :endDateNextDay)
                            AND (CAST(:startDateMain AS date) IS NULL OR s.activityDate >= :startDateMain)
                            AND (CAST(:endDateMain AS date) IS NULL OR s.activityDate <= :endDateMain)
                        ORDER BY s.activityDate DESC, s.activityId DESC
                        """, countQuery = "SELECT count(s) FROM SalesActivity s")
        Page<SalesActivity> findByFilters(
                        @Param("activityId") Long activityId,
                        @Param("salesName") String salesName,
                        @Param("customerName") String customerName,
                        @Param("contactPerson") String contactPerson,
                        @Param("isNewCustomer") Boolean isNewCustomer,
                        @Param("startDateStart") LocalDateTime startDateStart,
                        @Param("endDateNextDay") LocalDateTime endDateNextDay,
                        @Param("startDateMain") LocalDate startDateMain,
                        @Param("endDateMain") LocalDate endDateMain,
                        Pageable pageable);
}
