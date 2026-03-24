package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.StockLog;
import com.boxcorner.boxcorner.service.StockLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-logs")
@RequiredArgsConstructor
public class StockLogController {

    private final StockLogService stockLogService;

    @GetMapping
    public ResponseEntity<Page<StockLog>> getStockLogs(
            @RequestParam(name = "unitStockId", required = false) Long unitStockId,
            @RequestParam(name = "lotId", required = false) Integer lotId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
            
        return ResponseEntity.ok(stockLogService.getStockLogs(unitStockId, lotId, page, size));
    }
}
