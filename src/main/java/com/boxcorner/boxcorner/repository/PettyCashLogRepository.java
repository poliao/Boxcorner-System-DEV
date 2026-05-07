package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PettyCashLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PettyCashLogRepository extends JpaRepository<PettyCashLog, Long> {
    List<PettyCashLog> findByMenuKey(String menuKey);
}
