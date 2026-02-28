package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.StockLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    Page<StockLog> findByUnitStockIdOrderByTransactionDateDesc(Long unitStockId, Pageable pageable);

    Page<StockLog> findAllByOrderByTransactionDateDesc(Pageable pageable);
}
