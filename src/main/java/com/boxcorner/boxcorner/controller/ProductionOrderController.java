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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.ProductionOrder;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.ProductionOrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/production")
public class ProductionOrderController {

    @Autowired
    private ProductionOrderService productionOrderService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ProductionOrder productionOrder, HttpServletRequest httpRequest) {
        try {
            ProductionOrder savedData = productionOrderService.save(productionOrder,tokenService.getCurrentUser(httpRequest));
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
            @RequestParam(required = false, name = "id") Integer id,
            @RequestParam(required = false, name = "folderName") String folderName,
            @RequestParam(required = false, name = "jobOwner") String jobOwner,
            @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "deadlineTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false, name = "jobStatus") String jobStatus,
            @RequestParam(required = false, name = "processStatus") String processStatus,
            @RequestParam(required = false, name = "operatorName") String operatorName,
            @RequestParam(required = false, name = "moldStatus") String moldStatus,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductionOrder> result = productionOrderService.findByFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchProduct")
    public ResponseEntity<Page<ProductionOrder>> searchProduct(
            @RequestParam(required = false, name = "id") Integer id,
            @RequestParam(required = false, name = "folderName") String folderName,
            @RequestParam(required = false, name = "jobOwner") String jobOwner,
            @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "deadlineTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime deadlineTime,
            @RequestParam(required = false, name = "jobStatus") String jobStatus,
            @RequestParam(required = false, name = "processStatus") String processStatus,
            @RequestParam(required = false, name = "operatorName") String operatorName,
            @RequestParam(required = false, name = "moldStatus") String moldStatus,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductionOrder> result = productionOrderService.findByProductionFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable
        );
        return ResponseEntity.ok(result);
    }

    @PutMapping("/updateProcessStatus")
    public ResponseEntity<ProductionOrder> updateProcessStatus (@RequestParam("id") Integer id, @RequestParam("processStatus") String processStatus) {
        return ResponseEntity.ok(productionOrderService.updateProcessStatus(id,processStatus));
    }

    @PutMapping("/updateJobStatus")
    public ResponseEntity<ProductionOrder> updateJobStatus (@RequestParam("id") Integer id, @RequestParam("jobStatus") String jobStatus) {
        return ResponseEntity.ok(productionOrderService.updateJobStatus(id,jobStatus));
    }

    @PutMapping("/updateMoldStatus")
    public ResponseEntity<ProductionOrder> updateMoldStatus (@RequestParam("id") Integer id, @RequestParam("moldStatus") String moldStatus) {
        return ResponseEntity.ok(productionOrderService.updateMoldStatus(id, moldStatus));
    }

    @PutMapping("/updateMoldMakerName")
    public ResponseEntity<ProductionOrder> updateMoldMakerName (@RequestParam("id") Integer id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(productionOrderService.updateMoldMakerName(id, tokenService.getCurrentUser(httpRequest)));
    }
    
}