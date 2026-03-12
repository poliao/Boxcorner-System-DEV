package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.QcJob;

@Repository
public interface QcJobRepository extends JpaRepository<QcJob, Integer> {
}
