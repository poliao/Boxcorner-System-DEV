package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            @RequestParam(required = false, name = "deliveryStatus") String deliveryStatus,
            @RequestParam(required = false, name = "coatingLocation") String coatingLocation,
            @RequestParam(required = false, name = "stampingLocation") String stampingLocation,
            @RequestParam(required = false, name = "gluingLocation") String gluingLocation,
            @RequestParam(required = false, name = "startDate") LocalDate startDate,
            @RequestParam(required = false, name = "endDate") LocalDate endDate,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size) {

        Page<ProductionJob> result = productionJobService.findByFilters(
                id, jobId, customerName, printStatus, deliveryStatus, coatingLocation, 
                stampingLocation, gluingLocation, startDate, endDate, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchPrint")
    public ResponseEntity<Page<ProductionJob>> searchPrint(
            @RequestParam(required = false, name = "id") Long id,
            @RequestParam(required = false, name = "jobId") String jobId,
            @RequestParam(required = false, name = "customerName") String customerName,
            @RequestParam(required = false, name = "printStatus") String printStatus,
            @RequestParam(required = false, name = "startDate") LocalDate startDate,
            @RequestParam(required = false, name = "endDate") LocalDate endDate,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size) {

        Page<ProductionJob> result = productionJobService.findByFiltersPrint(
                id, jobId, customerName, printStatus, startDate, endDate, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchCoating")
    public ResponseEntity<Page<ProductionJob>> findByFiltersCoating(
            @RequestParam(required = false, name = "id") Long id,
            @RequestParam(required = false, name = "jobId") String jobId,
            @RequestParam(required = false, name = "customerName") String customerName,
            @RequestParam(required = false, name = "printStatus") String printStatus,
            @RequestParam(required = false, name = "startDate") LocalDate startDate,
            @RequestParam(required = false, name = "endDate") LocalDate endDate,
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size) {

        Page<ProductionJob> result = productionJobService.findByFiltersPrintingOS(
                id, jobId, customerName, printStatus, startDate, endDate, page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/update-qc-date")
    public ResponseEntity<?> updateQcDate(
            @RequestParam("id") Long id,
            @RequestParam("newDate") LocalDate newDate) {
        try {
            productionJobService.updateQcDate(id, newDate);
            return ResponseEntity.ok("อัปเดตวันที่ส่ง QC สำเร็จ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("เกิดข้อผิดพลาดในการอัปเดตวันที่: " + e.getMessage());
        }
    }

    @GetMapping("/findByPapOrderId")
    public ResponseEntity<ProductionJob> findByPapOrderId(@RequestParam("papOrderId") Integer papOrderId) {
        ProductionJob job = productionJobService.findByPapOrderId(papOrderId);
        if (job != null) {
            return ResponseEntity.ok(job);
        }
        return ResponseEntity.notFound().build();
    }
}