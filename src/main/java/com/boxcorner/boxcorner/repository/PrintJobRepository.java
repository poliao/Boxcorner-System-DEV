package com.boxcorner.boxcorner.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.PrintJob;

@Repository
public interface PrintJobRepository extends JpaRepository<PrintJob, Long> {
        List<PrintJob> findByPrinterName(String printerName);

        List<PrintJob> findByJobStatus(String status);

        @Query(value = """
                        SELECT * FROM print_jobs pj
                        WHERE (pj.printer_name IN ('Canon', 'Ricoh') OR (pj.issample IS TRUE and pj.printer_name NOT IN ('CD','SM','Bluesky')) OR (pj.issample IS TRUE and pj.printer_name IS NULL))
                            AND (:id IS NULL OR pj.id = :id)
                            AND (:jobId IS NULL OR :jobId = '' OR UPPER(pj.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                            AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
                            AND (:printerName IS NULL OR :printerName = '' OR UPPER(pj.printer_name) LIKE UPPER(CONCAT('%', :printerName, '%')))
                            AND (CAST(:startDate AS date) IS NULL OR pj.delivery_date >= CAST(:startDate AS date))
                            AND (CAST(:endDate AS date) IS NULL OR pj.delivery_date <= CAST(:endDate AS date))
                            AND (CAST(:issample AS boolean) IS NULL OR pj.issample = CAST(:issample AS boolean))
                            AND (:jobStatus IS NULL OR :jobStatus = '' OR CAST(pj.job_status AS TEXT) = :jobStatus)
                        ORDER BY pj.id DESC
                        """, nativeQuery = true)
        Page<PrintJob> findByFiltersAll(
                        @Param("id") Long id,
                        @Param("jobId") String jobId,
                        @Param("customerJobName") String customerJobName,
                        @Param("printerName") String printerName,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate,
                        @Param("issample") Boolean issample,
                        @Param("jobStatus") String jobStatus,
                        Pageable pageable);

        @Query(value = """
                        SELECT * FROM print_jobs pj WHERE
                        pj.printer_name in ('CD','SM')
                        AND(:id IS NULL OR pj.id = :id)
                        AND (:jobId IS NULL OR :jobId = '' OR UPPER(pj.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                        AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
                        AND (:printerName IS NULL OR :printerName = '' OR UPPER(pj.printer_name) LIKE UPPER(CONCAT('%', :printerName, '%')))
                        AND (:jobStatus IS NULL OR :jobStatus = '' OR CAST(pj.job_status AS TEXT) = :jobStatus)
                        ORDER BY pj.id DESC
                        """, nativeQuery = true)
        Page<PrintJob> findByFiltersOS(
                        @Param("id") Long id,
                        @Param("jobId") String jobId,
                        @Param("customerJobName") String customerJobName,
                        @Param("printerName") String printerName,
                        @Param("jobStatus") String jobStatus,
                        Pageable pageable);

        @Query("SELECT DISTINCT pj.jobId FROM PrintJob pj WHERE pj.jobId IN :jobIds AND (pj.issample IS NULL OR pj.issample = false)")
        List<String> findRealJobIdsByJobIds(@Param("jobIds") List<String> jobIds);

        @Query(value = """
                        SELECT * FROM print_jobs pj
                        WHERE
                            (pj.printer_name IN ('Canon', 'Ricoh') OR (pj.issample IS TRUE and pj.printer_name NOT IN ('CD','SM','Bluesky')) OR (pj.issample IS TRUE and pj.printer_name IS NULL))
                            AND (pj.issample IS TRUE)
                            AND (:id IS NULL OR pj.id = :id)
                            AND (:jobId IS NULL OR :jobId = '' OR UPPER(pj.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                            AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
                            AND (:printerName IS NULL OR :printerName = '' OR UPPER(pj.printer_name) LIKE UPPER(CONCAT('%', :printerName, '%')))
                            AND (:startDate IS NULL OR pj.delivery_date >= :startDate)
                            AND (:endDate IS NULL OR pj.delivery_date <= :endDate)
                            AND (:jobStatus IS NULL OR :jobStatus = '' OR CAST(pj.job_status AS TEXT) = :jobStatus)
                        ORDER BY pj.id DESC
                        """, nativeQuery = true)
        Page<PrintJob> findByFiltersODPrinter(
                        @Param("id") Long id,
                        @Param("jobId") String jobId,
                        @Param("customerJobName") String customerJobName,
                        @Param("printerName") String printerName,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate,
                        @Param("jobStatus") String jobStatus,
                        Pageable pageable);

    @Query(value = "SELECT * FROM print_jobs pj WHERE pj.production_order_id = CAST(:productionOrderId AS text) LIMIT 1", nativeQuery = true)
    PrintJob findByProductionOrderId(@Param("productionOrderId") Integer productionOrderId);
}