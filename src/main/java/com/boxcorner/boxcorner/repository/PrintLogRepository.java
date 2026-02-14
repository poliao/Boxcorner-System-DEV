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
}