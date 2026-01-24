package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.ProductionJob;
import com.boxcorner.boxcorner.service.ProductionJobService;

@RestController
@RequestMapping("/api/production-job")
public class ProductionJobController {

    @Autowired
    private ProductionJobService productionJobService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ProductionJob productionJob) {
        try {
            ProductionJob savedData = productionJobService.save(productionJob);
            return ResponseEntity.ok(savedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving data: " + e.getMessage());
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam("id") Long id) {
        try {
            ProductionJob data = productionJobService.findById(id);
            if (data != null) {
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Production job not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving data: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductionJob>> search(
            @RequestParam(required = false, name = "id") Long id,
            @RequestParam(required = false, name = "jobId") String jobId,
            @RequestParam(required = false, name = "customerName") String customerName,
            @RequestParam(required = false, name = "printStatus") String printStatus,
            @RequestParam(required = false, name = "startDate") String startDateStr,
            @RequestParam(required = false, name = "endDate") String endDateStr,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            
            java.time.LocalDate startDate = null;
            java.time.LocalDate endDate = null;
            
            if (startDateStr != null && !startDateStr.isEmpty()) {
                startDate = java.time.LocalDate.parse(startDateStr);
            }
            if (endDateStr != null && !endDateStr.isEmpty()) {
                endDate = java.time.LocalDate.parse(endDateStr);
            }
            
            Page<ProductionJob> result = productionJobService.findByFilters(
                id, jobId, customerName, printStatus, startDate, endDate, pageable);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}