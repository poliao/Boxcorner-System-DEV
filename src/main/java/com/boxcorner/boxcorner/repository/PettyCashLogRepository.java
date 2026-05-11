package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PettyCashLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PettyCashLogRepository extends JpaRepository<PettyCashLog, Long> {
    List<PettyCashLog> findByMenuKey(String menuKey);

    List<PettyCashLog> findByJobNo(String jobNo);

    @Modifying
    @Query("UPDATE PettyCashLog p SET p.jobStatus = :status WHERE p.jobNo = :jobNo AND p.cashType = 'expense'")
    int updateJobStatusByJobNo(@Param("jobNo") String jobNo, @Param("status") String status);
}
