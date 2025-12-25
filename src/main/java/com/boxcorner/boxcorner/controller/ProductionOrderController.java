package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.ProductionOrder;
import com.boxcorner.boxcorner.service.ProductionOrderService;

@RestController
@RequestMapping("/api/production")
public class ProductionOrderController {

    @Autowired
    private ProductionOrderService productionOrderService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ProductionOrder productionOrder) {
        try {
            ProductionOrder savedData = productionOrderService.save(productionOrder);
            return ResponseEntity.ok(savedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving data: " + e.getMessage());
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam("id") Integer id) {
        try {
            ProductionOrder data = productionOrderService.findById(id);
            if (data != null) {
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving data: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductionOrder>> search(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String folderName,
            @RequestParam(required = false) String jobOwner,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false) String jobStatus,
            @RequestParam(required = false) String processStatus,
            @RequestParam(required = false) String operatorName,
            @RequestParam(required = false) String moldStatus,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductionOrder> result = productionOrderService.findByFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable
        );
        return ResponseEntity.ok(result);
    }
}