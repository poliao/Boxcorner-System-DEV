package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.HrApprover;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HrApproverRepository extends JpaRepository<HrApprover, Long> {
    boolean existsByUserId(String userId);
}
