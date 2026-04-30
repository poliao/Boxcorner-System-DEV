package com.boxcorner.boxcorner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.QcJob;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface QcJobRepository extends JpaRepository<QcJob, Integer> {

    List<QcJob> findByJoId(String joId);

    @Query("SELECT q FROM QcJob q WHERE " +
            "(:joId IS NULL OR q.joId LIKE %:joId%) AND " +
            "(:jobName IS NULL OR q.jobName LIKE %:jobName%) AND " +
            "(:status IS NULL OR q.status = :status) AND " +
            "(:qcType IS NULL OR q.qcType = :qcType) AND " +
            "(:qcLocation IS NULL OR q.qcLocation = :qcLocation) AND " +
            "(CAST(:startFrom AS DATE) IS NULL OR q.startQcDatetime >= :startFrom) AND " +
            "(CAST(:startTo AS DATE) IS NULL OR q.startQcDatetime <= :startTo) AND " +
            "(CAST(:deliveryFrom AS DATE) IS NULL OR q.deliveryDatetime >= :deliveryFrom) AND " +
            "(CAST(:deliveryTo AS DATE) IS NULL OR q.deliveryDatetime <= :deliveryTo) " +
            "ORDER BY " +
            "  CASE q.status " +
            "    WHEN 'เข้าตรวจแล้ว' THEN 1 " +
            "    WHEN 'แบ่งส่ง' THEN 2 " +
            "    WHEN 'อยู่ระหว่างตรวจ' THEN 3 " +
            "    WHEN 'รอส่งตรวจ' THEN 4 " +
            "    WHEN 'เสร็จสิ้น' THEN 5 " +
            "    ELSE 6 " +
            "  END ASC, " +
            "  q.deliveryDatetime ASC")
    Page<QcJob> findByFilters(
            @Param("joId") String joId,
            @Param("jobName") String jobName,
            @Param("status") String status,
            @Param("qcType") String qcType,
            @Param("qcLocation") String qcLocation,
            @Param("startFrom") LocalDate startFrom,
            @Param("startTo") LocalDate startTo,
            @Param("deliveryFrom") LocalDate deliveryFrom,
            @Param("deliveryTo") LocalDate deliveryTo,
            Pageable pageable);

    long countByStatusInAndQcLocation(java.util.List<String> statuses, String qcLocation);

    long countByStatusNotAndDeliveryDatetimeLessThanEqualAndQcLocation(String status, LocalDate date, String qcLocation);
}
