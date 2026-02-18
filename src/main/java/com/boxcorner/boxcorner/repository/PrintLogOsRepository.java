package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PrintLogOs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintLogOsRepository extends JpaRepository<PrintLogOs, Long> {
    List<PrintLogOs> findByJobId(Long jobId);
}
