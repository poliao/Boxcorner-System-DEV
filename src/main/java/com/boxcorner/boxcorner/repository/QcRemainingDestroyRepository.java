package com.boxcorner.boxcorner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.QcRemainingDestroy;

@Repository
public interface QcRemainingDestroyRepository extends JpaRepository<QcRemainingDestroy, Integer> {
    List<QcRemainingDestroy> findByQcJobIdOrderByIdAsc(Integer qcJobId);
}
