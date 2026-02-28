package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PrintLogQa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintLogQaRepository extends JpaRepository<PrintLogQa, Long> {
    List<PrintLogQa> findByJobIdOrderByCreatedAtDesc(Long jobId);
}
