package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.CoatingJob;
import com.boxcorner.boxcorner.entity.CoatingLog;
import com.boxcorner.boxcorner.service.CoatingJobService;
import com.boxcorner.boxcorner.service.CoatingLogService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/coating-jobs")
public class CoatingJobController {

    @Autowired
    private CoatingJobService coatingJobService;

    @Autowired
    private CoatingLogService coatingLogService;

    @PostMapping("/create")
    public ResponseEntity<?> createCoatingJob(@RequestBody CoatingJob coatingJob) {
        try {
            return ResponseEntity.ok(coatingJobService.createCoatingJob(coatingJob));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CoatingJob>> searchCoatingJobs(
            @RequestParam(value = "joId", required = false) String joId,
            @RequestParam(value = "jobCustomerName", required = false) String jobCustomerName,
            @RequestParam(value = "jobOwnerName", required = false) String jobOwnerName,
            @RequestParam(value = "technicianName", required = false) String technicianName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(coatingJobService.getCoatingJobsWithSearch(
                joId, jobCustomerName, jobOwnerName, technicianName, pageable));
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getCoatingJobById(@RequestParam("id") int id) {
        try {
            return coatingJobService.getCoatingJobById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/start-coating")
    public ResponseEntity<?> startCoating(@RequestBody Map<String, Object> payload) {
        try {
            Integer coatingJobId = (Integer) payload.get("coatingJobId");
            String laminatingTemp = payload.get("laminatingTemp") != null ? payload.get("laminatingTemp").toString()
                    : null;
            String coatingType = payload.get("coatingType") != null ? payload.get("coatingType").toString() : null;
            Integer filmStockId = payload.get("filmStockId") != null
                    ? Integer.valueOf(payload.get("filmStockId").toString())
                    : null;
            String filmStockName = payload.get("filmStockName") != null ? payload.get("filmStockName").toString()
                    : null;
            String paperLength = payload.get("paperLength") != null ? payload.get("paperLength").toString() : null;
            String technicianName = payload.get("technicianName") != null ? payload.get("technicianName").toString()
                    : null;

            CoatingJob job = coatingJobService.getCoatingJobById(coatingJobId)
                    .orElseThrow(() -> new RuntimeException("ไม่พบงานเคลือบ id=" + coatingJobId));

            CoatingLog logEntry = CoatingLog.builder()
                    .coatingJobId(coatingJobId)
                    .joId(job.getJoId())
                    .jobCustomerName(job.getJobCustomerName())
                    .coatingType(coatingType)
                    .laminatingTemp(laminatingTemp)
                    .filmStockId(filmStockId != null ? filmStockId.longValue() : null)
                    .filmStockName(filmStockName)
                    .paperLength(paperLength)
                    .sheetQty(job.getRequiredSheetsQty())
                    .reportDate(LocalDate.now())
                    .startTime(LocalTime.now())
                    .technicianName(technicianName)
                    .build();

            coatingLogService.save(logEntry, technicianName != null ? technicianName : "");

            return ResponseEntity.ok(Map.of("message", "เริ่มเคลือบสำเร็จ"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
