package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.OdCutPaperUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OdCutPaperUsageLogRepository extends JpaRepository<OdCutPaperUsageLog, Long> {
    List<OdCutPaperUsageLog> findByOdCutPaperId(Long odCutPaperId);
    List<OdCutPaperUsageLog> findByJobId(Long jobId);
}
