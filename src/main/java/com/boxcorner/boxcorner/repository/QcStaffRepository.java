package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.QcStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QcStaffRepository extends JpaRepository<QcStaff, Integer> {
    List<QcStaff> findByQcJobId(Integer qcJobId);
}
