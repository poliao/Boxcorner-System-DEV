package com.boxcorner.boxcorner.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.PrintLog;

@Repository
public interface PrintLogRepository extends JpaRepository<PrintLog, Long> {

  Optional<PrintLog> findByPrinterIdAndEndedAtIsNull(Integer printerId);

  List<PrintLog> findByJobIdOrderByStartedAtDesc(Long jobId);

  List<PrintLog> findByJobIdIn(List<Long> jobIds);

  @org.springframework.data.jpa.repository.Query(value = """
      SELECT pl.* FROM print_logs pl
      LEFT JOIN print_jobs pj ON pl.job_id = pj.id
      WHERE (:id IS NULL OR pl.id = :id)
        AND (:jobId IS NULL OR :jobId = '' OR UPPER(pj.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
        AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
        AND (:issample IS NULL OR pj.issample = :issample)
        AND (:jobStatus IS NULL OR :jobStatus = '' OR CAST(pj.job_status AS TEXT) = :jobStatus)
        AND (CAST(:startDate AS timestamp) IS NULL OR pl.started_at >= CAST(:startDate AS timestamp))
        AND (CAST(:endDate AS timestamp) IS NULL OR pl.started_at <= CAST(:endDate AS timestamp))
      ORDER BY pl.started_at DESC
      """, nativeQuery = true)
  org.springframework.data.domain.Page<PrintLog> findByFilters(
      @org.springframework.data.repository.query.Param("id") Long id,
      @org.springframework.data.repository.query.Param("jobId") String jobId,
      @org.springframework.data.repository.query.Param("customerJobName") String customerJobName,
      @org.springframework.data.repository.query.Param("issample") Boolean issample,
      @org.springframework.data.repository.query.Param("jobStatus") String jobStatus,
      @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
      @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
      org.springframework.data.domain.Pageable pageable);

  @org.springframework.data.jpa.repository.Query(value = """
      SELECT
          pr.brand as brand,
          STRING_AGG(DISTINCT pr.name, ', ') as printerNames,
          MIN(pl.meter_color_start) as minColorStart,
          MAX(pl.meter_color_end) as maxColorEnd,
          MIN(pl.meter_bw_start) as minBwStart,
          MAX(pl.meter_bw_end) as maxBwEnd,
          MIN(pl.meter_special_start) as minSpecialStart,
          MAX(pl.meter_special_end) as maxSpecialEnd,
          SUM(CASE WHEN pl.meter_color_end IS NOT NULL THEN (pl.meter_color_end - pl.meter_color_start) ELSE 0 END) as sumColor,
          SUM(CASE WHEN pl.meter_bw_end IS NOT NULL THEN (pl.meter_bw_end - pl.meter_bw_start) ELSE 0 END) as sumBw,
          SUM(CASE WHEN pl.meter_special_end IS NOT NULL THEN (pl.meter_special_end - pl.meter_special_start) ELSE 0 END) as sumSpecial
      FROM print_logs pl
      LEFT JOIN print_jobs pj ON pl.job_id = pj.id
      LEFT JOIN printers pr ON pl.printer_id = pr.id
      WHERE (:id IS NULL OR pl.id = :id)
        AND (:jobId IS NULL OR :jobId = '' OR UPPER(pj.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
        AND (:customerJobName IS NULL OR :customerJobName = '' OR UPPER(pj.customer_job_name) LIKE UPPER(CONCAT('%', :customerJobName, '%')))
        AND (:issample IS NULL OR pj.issample = :issample)
        AND (:jobStatus IS NULL OR :jobStatus = '' OR CAST(pj.job_status AS TEXT) = :jobStatus)
        AND (CAST(:startDate AS timestamp) IS NULL OR pl.started_at >= CAST(:startDate AS timestamp))
        AND (CAST(:endDate AS timestamp) IS NULL OR pl.started_at <= CAST(:endDate AS timestamp))
      GROUP BY pr.brand
      """, nativeQuery = true)
  java.util.List<java.util.Map<String, Object>> getLogSummary(
      @org.springframework.data.repository.query.Param("id") Long id,
      @org.springframework.data.repository.query.Param("jobId") String jobId,
      @org.springframework.data.repository.query.Param("customerJobName") String customerJobName,
      @org.springframework.data.repository.query.Param("issample") Boolean issample,
      @org.springframework.data.repository.query.Param("jobStatus") String jobStatus,
      @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
      @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);

  @org.springframework.data.jpa.repository.Query(value = """
      SELECT pl.* FROM print_logs pl
      WHERE pl.job_id IS NULL
        AND (CAST(:startDate AS timestamp) IS NULL OR pl.started_at >= CAST(:startDate AS timestamp))
        AND (CAST(:endDate AS timestamp) IS NULL OR pl.started_at <= CAST(:endDate AS timestamp))
      ORDER BY pl.started_at DESC
      """, nativeQuery = true)
  java.util.List<PrintLog> findStandaloneLogs(
      @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
      @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);
}