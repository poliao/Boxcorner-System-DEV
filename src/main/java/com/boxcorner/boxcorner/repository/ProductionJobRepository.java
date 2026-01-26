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

        @Query(value = """
                        SELECT * FROM production_jobs p WHERE
                        (CAST(:id AS BIGINT) IS NULL OR p.id = :id) AND
                        (CAST(:jobId AS TEXT) IS NULL OR p.job_code LIKE '%' || :jobId || '%') AND
                        (CAST(:customerJobName AS TEXT) IS NULL OR p.customer_job_name LIKE '%' || :customerJobName || '%') AND
                        (CAST(:printStatus AS TEXT) IS NULL OR p.print_status = :printStatus) AND
                        (CAST(:startDate AS DATE) IS NULL OR p.due_date >= :startDate) AND
                        (CAST(:endDate AS DATE) IS NULL OR p.due_date <= :endDate)
                        ORDER BY p.id DESC
                        """, countQuery = "SELECT count(*) FROM production_jobs p", nativeQuery = true)
        Page<ProductionJob> findByFilters(
                        @Param("id") Long id,
                        @Param("jobId") String jobId,
                        @Param("customerJobName") String customerJobName,
                        @Param("printStatus") String printStatus,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        @Query(value = """
                        SELECT * FROM production_jobs pj
                        WHERE pj.print_status != 'จัดส่งเรียบร้อย'
                        AND date_trunc('month', pj.due_date) = date_trunc('month', CURRENT_DATE)
                        """,countQuery = "SELECT count(*) FROM production_jobs pj", nativeQuery = true)
        Page<ProductionJob> findUndeliveredJobsThisMonth(Pageable pageable);
}