package com.boxcorner.boxcorner.repository;

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
        // ค้นหาคิวงานตามเครื่องพิมพ์
        List<PrintJob> findByPrinterName(String printerName);

        // ค้นหาตามสถานะงาน
        List<PrintJob> findByJobStatus(String status);

        @Query(value = """
                        SELECT * FROM print_jobs pj WHERE
                        pj.printer_name in ('Canon','Ricoh','Bluesky') 
                        AND(:id IS NULL OR pj.id = :id)
                        AND (:jobId IS NULL OR pj.job_id = :jobId)
                        AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
                        AND (:printerName IS NULL OR :printerName = '' OR UPPER(pj.printer_name) LIKE UPPER(CONCAT('%', :printerName, '%')))
                        ORDER BY pj.id DESC
                        """, nativeQuery = true)
        Page<PrintJob> findByFiltersAll(
                        @Param("id") Long id,
                        @Param("jobId") String jobId,
                        @Param("customerJobName") String customerJobName,
                        @Param("printerName") String printerName,
                        Pageable pageable);

        @Query(value = """
                        SELECT * FROM print_jobs pj WHERE
                        pj.printer_name in ('CD','SM')
                        AND(:id IS NULL OR pj.id = :id)
                        AND (:jobId IS NULL OR pj.job_id = :jobId)
                        AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
                        AND (:printerName IS NULL OR :printerName = '' OR UPPER(pj.printer_name) LIKE UPPER(CONCAT('%', :printerName, '%')))
                        ORDER BY pj.id DESC
                        """, nativeQuery = true)
        Page<PrintJob> findByFiltersOS(
                        @Param("id") Long id,
                        @Param("jobId") String jobId,
                        @Param("customerJobName") String customerJobName,
                        @Param("printerName") String printerName,
                        Pageable pageable);

}