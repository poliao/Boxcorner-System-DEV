package com.boxcorner.boxcorner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.QcRemainingDestroyStaff;

@Repository
public interface QcRemainingDestroyStaffRepository extends JpaRepository<QcRemainingDestroyStaff, Integer> {
    List<QcRemainingDestroyStaff> findByQcRemainingDestroyIdOrderByIdAsc(Integer qcRemainingDestroyId);
    List<QcRemainingDestroyStaff> findByQcJobIdOrderByIdAsc(Integer qcJobId);
}
