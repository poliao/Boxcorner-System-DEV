package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.LogQc;

@Repository
public interface LogQcRepository extends JpaRepository<LogQc, Integer> {
}
