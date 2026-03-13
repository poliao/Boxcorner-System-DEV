package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.LogQc;

import java.util.Optional;

@Repository
public interface LogQcRepository extends JpaRepository<LogQc, Integer> {
    Optional<LogQc> findTopByQcJobIdOrderByIdDesc(Integer qcJobId);
}
