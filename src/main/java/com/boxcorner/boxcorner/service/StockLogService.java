package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.StockLog;
import com.boxcorner.boxcorner.repository.StockLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockLogService {

    private final StockLogRepository stockLogRepository;

    public void logTransaction(StockLog log) {
        stockLogRepository.save(log);
    }

    public Page<StockLog> getStockLogs(Long unitStockId, Integer lotId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        if (lotId != null) {
            return stockLogRepository.findByLotIdOrderByTransactionDateDesc(lotId, pageRequest);
        } else if (unitStockId != null) {
            return stockLogRepository.findByUnitStockIdOrderByTransactionDateDesc(unitStockId, pageRequest);
        } else {
            return stockLogRepository.findAllByOrderByTransactionDateDesc(pageRequest);
        }
    }
}
