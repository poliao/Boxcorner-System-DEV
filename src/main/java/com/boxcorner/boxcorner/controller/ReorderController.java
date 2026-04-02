package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.dto.ReorderDTO;
import com.boxcorner.boxcorner.service.ReorderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reorder")
@RequiredArgsConstructor
public class ReorderController {

    private final ReorderService reorderService;

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String jobId,
            @RequestParam(required = false) String folderName,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String jobOwner,
            @RequestParam(required = false) String jobStatus,
            @RequestParam(required = false) String processStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<ReorderDTO> result = reorderService.search(
                    jobId, folderName, customerName, jobOwner, jobStatus, processStatus, startDate, endDate, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getDetail(@RequestParam Integer productionOrderId) {
        try {
            return ResponseEntity.ok(reorderService.getDetail(productionOrderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
