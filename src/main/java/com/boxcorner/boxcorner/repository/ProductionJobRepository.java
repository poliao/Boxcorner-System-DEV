package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.ProductionJob;

@Repository
public interface ProductionJobRepository extends JpaRepository<ProductionJob, Long> {

    // @Query(value = """
    // SELECT * FROM production_jobs p WHERE
    // (CAST(:id AS BIGINT) IS NULL OR p.id = :id) AND
    // (CAST(:jobId AS TEXT) IS NULL OR p.job_code LIKE '%' || :jobId || '%') AND
    // (CAST(:customerJobName AS TEXT) IS NULL OR p.customer_job_name LIKE '%' ||
    // :customerJobName || '%') AND
    // (CAST(:printStatus AS TEXT) IS NULL OR p.print_status = :printStatus) AND
    // (CAST(:startDate AS DATE) IS NULL OR p.due_date >= :startDate) AND
    // (CAST(:endDate AS DATE) IS NULL OR p.due_date <= :endDate)
    // ORDER BY p.due_date ASC
    // """, countQuery = "SELECT count(*) FROM production_jobs p", nativeQuery =
    // true)
    // Page<ProductionJob> findByFilters(
    // @Param("id") Long id,
    // @Param("jobId") String jobId,
    // @Param("customerJobName") String customerJobName,
    // @Param("printStatus") String printStatus,
    // @Param("startDate") LocalDate startDate,
    // @Param("endDate") LocalDate endDate,
    // Pageable pageable);

    @Query(value = """
            SELECT * FROM production_jobs p WHERE
            (CAST(:id AS BIGINT) IS NULL OR p.id = :id) AND
            (CAST(:jobId AS TEXT) IS NULL OR p.job_code LIKE '%' || :jobId || '%') AND
            (CAST(:customerJobName AS TEXT) IS NULL OR p.customer_job_name LIKE '%' || :customerJobName || '%') AND
            (CAST(:printStatus AS TEXT) IS NULL OR p.print_status = :printStatus) AND
            (CAST(:deliveryStatus AS TEXT) IS NULL OR p.delivery_status = :deliveryStatus) AND
            (CAST(:coatingLocation AS TEXT) IS NULL OR p.coating_responsible LIKE '%' || :coatingLocation || '%') AND
            (CAST(:stampingLocation AS TEXT) IS NULL OR p.stamping_responsible LIKE '%' || :stampingLocation || '%') AND
            (CAST(:gluingLocation AS TEXT) IS NULL OR p.gluing_responsible LIKE '%' || :gluingLocation || '%') AND
            (CAST(:startDate AS DATE) IS NULL OR p.due_date >= :startDate) AND
            (CAST(:endDate AS DATE) IS NULL OR p.due_date <= :endDate)
            ORDER BY
                (CASE WHEN p.delivery_status = 'จัดส่งเรียบร้อย' THEN 1 ELSE 0 END) ASC,
                p.due_date ASC,
                p.id DESC
            """, countQuery = "SELECT count(*) FROM production_jobs p WHERE "
            +
            "(CAST(:id AS BIGINT) IS NULL OR p.id = :id) AND " +
            "(CAST(:jobId AS TEXT) IS NULL OR p.job_code LIKE '%' || :jobId || '%') AND " +
            "(CAST(:customerJobName AS TEXT) IS NULL OR p.customer_job_name LIKE '%' || :customerJobName || '%') AND "
            +
            "(CAST(:printStatus AS TEXT) IS NULL OR p.print_status = :printStatus) AND " +
            "(CAST(:deliveryStatus AS TEXT) IS NULL OR p.delivery_status = :deliveryStatus) AND " +
            "(CAST(:coatingLocation AS TEXT) IS NULL OR p.coating_responsible LIKE '%' || :coatingLocation || '%') AND " +
            "(CAST(:stampingLocation AS TEXT) IS NULL OR p.stamping_responsible LIKE '%' || :stampingLocation || '%') AND " +
            "(CAST(:gluingLocation AS TEXT) IS NULL OR p.gluing_responsible LIKE '%' || :gluingLocation || '%') AND " +
            "(CAST(:startDate AS DATE) IS NULL OR p.due_date >= :startDate) AND " +
            "(CAST(:endDate AS DATE) IS NULL OR p.due_date <= :endDate)", nativeQuery = true)
    Page<ProductionJob> findByFilters(
            @Param("id") Long id,
            @Param("jobId") String jobId,
            @Param("customerJobName") String customerJobName,
            @Param("printStatus") String printStatus,
            @Param("deliveryStatus") String deliveryStatus,
            @Param("coatingLocation") String coatingLocation,
            @Param("stampingLocation") String stampingLocation,
            @Param("gluingLocation") String gluingLocation,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM production_jobs pj
            WHERE pj.print_status != 'จัดส่งเรียบร้อย'
            AND date_trunc('month', pj.due_date) = date_trunc('month', CURRENT_DATE)
            """, countQuery = "SELECT count(*) FROM production_jobs pj", nativeQuery = true)
    Page<ProductionJob> findUndeliveredJobsThisMonth(Pageable pageable);

    @Query(value = """
            SELECT * FROM production_jobs p WHERE
            p.printing_date IS NOT NULL AND
            p.printing_responsible IN ('Canon', 'Ricoh') AND
            (CAST(:id AS BIGINT) IS NULL OR p.id = :id) AND
            (CAST(:jobId AS TEXT) IS NULL OR p.job_code LIKE '%' || :jobId || '%') AND
            (CAST(:customerJobName AS TEXT) IS NULL OR p.customer_job_name LIKE '%' || :customerJobName || '%') AND
            (CAST(:printStatus AS TEXT) IS NULL OR p.print_status = :printStatus) AND
            (CAST(:startDate AS DATE) IS NULL OR p.due_date >= :startDate) AND
            (CAST(:endDate AS DATE) IS NULL OR p.due_date <= :endDate)
            ORDER BY p.id DESC
            """, countQuery = "SELECT count(*) FROM production_jobs p", nativeQuery = true)
    Page<ProductionJob> findByFiltersPrinting(
            @Param("id") Long id,
            @Param("jobId") String jobId,
            @Param("customerJobName") String customerJobName,
            @Param("printStatus") String printStatus,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM production_jobs p WHERE
            p.printing_date IS NOT NULL AND
            p.printing_responsible IN ('SM','CD') AND
            (CAST(:id AS BIGINT) IS NULL OR p.id = :id) AND
            (CAST(:jobId AS TEXT) IS NULL OR p.job_code LIKE '%' || :jobId || '%') AND
            (CAST(:customerJobName AS TEXT) IS NULL OR p.customer_job_name LIKE '%' || :customerJobName || '%') AND
            (CAST(:printStatus AS TEXT) IS NULL OR p.print_status = :printStatus) AND
            (CAST(:startDate AS DATE) IS NULL OR p.due_date >= :startDate) AND
            (CAST(:endDate AS DATE) IS NULL OR p.due_date <= :endDate)
            ORDER BY p.id DESC
            """, countQuery = "SELECT count(*) FROM production_jobs p", nativeQuery = true)
    Page<ProductionJob> findByFiltersPrintingOS(
            @Param("id") Long id,
            @Param("jobId") String jobId,
            @Param("customerJobName") String customerJobName,
            @Param("printStatus") String printStatus,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
}