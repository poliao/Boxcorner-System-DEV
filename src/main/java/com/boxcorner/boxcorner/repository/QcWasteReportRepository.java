package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.QcWasteReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QcWasteReportRepository extends JpaRepository<QcWasteReport, Long> {
    List<QcWasteReport> findByQcJobId(Integer qcJobId);
}
