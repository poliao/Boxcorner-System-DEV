package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.dto.ReorderDTO;
import com.boxcorner.boxcorner.entity.dto.ReorderDesignRequest;
import com.boxcorner.boxcorner.entity.dto.ReorderSampleRequest;
import com.boxcorner.boxcorner.entity.dto.ReorderProductionRequest;
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
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "jobStatus", required = false) String jobStatus,
            @RequestParam(value = "processStatus", required = false) String processStatus,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        try {
            Page<ReorderDTO> result = reorderService.search(
                    jobId, folderName, customerName, jobOwner, jobStatus, processStatus, startDate, endDate, page,
                    size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getDetail(@RequestParam(value = "productionOrderId") Integer productionOrderId) {
        try {
            return ResponseEntity.ok(reorderService.getDetail(productionOrderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/job-history")
    public ResponseEntity<?> getJobHistory(@RequestParam(value = "jobId") String jobId) {
        try {
            return ResponseEntity.ok(reorderService.getJobHistory(jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reorder-design")
    public ResponseEntity<?> reorderDesign(@RequestBody ReorderDesignRequest req) {
        try {
            return ResponseEntity.ok(reorderService.reorderDesign(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reorder-sample")
    public ResponseEntity<?> reorderSample(@RequestBody ReorderSampleRequest req) {
        try {
            return ResponseEntity.ok(reorderService.reorderSample(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reorder-production")
    public ResponseEntity<?> reorderProduction(@RequestBody ReorderProductionRequest req) {
        try {
            return ResponseEntity.ok(reorderService.reorderProduction(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
