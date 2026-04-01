package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.OdCutPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OdCutPaperRepository extends JpaRepository<OdCutPaper, Long> {
    List<OdCutPaper> findByStatusOrderByCreatedAtDesc(OdCutPaper.Status status);
}
