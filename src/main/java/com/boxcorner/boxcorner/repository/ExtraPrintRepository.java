package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.ExtraPrint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExtraPrintRepository extends JpaRepository<ExtraPrint, Long> {
    List<ExtraPrint> findByPrintJobIdOrderByCreatedAtDesc(Long printJobId);

    List<ExtraPrint> findByPrintJobIdIn(List<Long> printJobIds);
}
