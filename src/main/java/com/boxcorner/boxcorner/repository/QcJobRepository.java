package com.boxcorner.boxcorner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.QcJob;
import java.time.LocalDate;

@Repository
public interface QcJobRepository extends JpaRepository<QcJob, Integer> {

    @Query("SELECT q FROM QcJob q WHERE " +
           "(:joId IS NULL OR q.joId LIKE %:joId%) AND " +
           "(:jobName IS NULL OR q.jobName LIKE %:jobName%) AND " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:qcType IS NULL OR q.qcType = :qcType) AND " +
           "(:startFrom IS NULL OR q.startQcDatetime >= :startFrom) AND " +
           "(:startTo IS NULL OR q.startQcDatetime <= :startTo) AND " +
           "(:deliveryFrom IS NULL OR q.deliveryDatetime >= :deliveryFrom) AND " +
           "(:deliveryTo IS NULL OR q.deliveryDatetime <= :deliveryTo)")
    Page<QcJob> findByFilters(
        @Param("joId") String joId,
        @Param("jobName") String jobName,
        @Param("status") String status,
        @Param("qcType") String qcType,
        @Param("startFrom") LocalDate startFrom,
        @Param("startTo") LocalDate startTo,
        @Param("deliveryFrom") LocalDate deliveryFrom,
        @Param("deliveryTo") LocalDate deliveryTo,
        Pageable pageable);
}
