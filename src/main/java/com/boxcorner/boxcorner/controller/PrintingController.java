package com.boxcorner.boxcorner.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.PrintLog;
import com.boxcorner.boxcorner.entity.dto.CalibrateRequest;
import com.boxcorner.boxcorner.entity.dto.ReturnPaperRequest;
import com.boxcorner.boxcorner.entity.dto.StartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.StopPrintRequest;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.PrintingService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/printing")
@RequiredArgsConstructor
public class PrintingController {

    private final PrintingService printingService;

    @Autowired
    private TokenService tokenService;

    // =================================================================
    // 1. เริ่มงาน (Start / Resume)
    // URL: POST /api/printing/start
    // =================================================================
    @PostMapping("/start")
    public ResponseEntity<?> startJob(@RequestBody StartPrintRequest request, HttpServletRequest httpRequest) {
        try {
            PrintLog newLog = printingService.startPrinting(request, tokenService.getCurrentUser(httpRequest));

            return ResponseEntity.ok(Map.of(
                    "status", "STARTED",
                    "logId", newLog.getId(),
                    "startedAt", newLog.getStartedAt()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/stop")
    public ResponseEntity<?> stopJob(@RequestBody StopPrintRequest request) {
        try {
            PrintLog updatedLog = printingService.stopPrinting(request);

            return ResponseEntity.ok(Map.of(
                    "status", request.getAction(),
                    "logId", updatedLog.getId(),
                    "totalImpressions", updatedLog.getTotalImpressions(),
                    "endedAt", updatedLog.getEndedAt()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/active-log")
    public ResponseEntity<?> checkActiveLog(@RequestParam(value = "printerId") Integer printerId) {
        PrintLog activeLog = printingService.getActiveLogByPrinter(printerId);

        if (activeLog != null) {
            return ResponseEntity.ok(Map.of(
                    "isActive", true,
                    "logId", activeLog.getId(),
                    "jobId", activeLog.getJob().getId(),
                    "meterStart", activeLog.getMeterColorStart(),
                    "printSide", activeLog.getPrintSide()));
        } else {
            return ResponseEntity.ok(Map.of("isActive", false));
        }
    }

    @GetMapping("/logById")
    public ResponseEntity<?> getPrintLog(@RequestParam(value = "logId") Long logId) {
        PrintLog log = printingService.gePrintLog(logId);
        if (log != null) {
            return ResponseEntity.ok(log);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/saveCalibrate")
    public ResponseEntity<?> saveCalibrate(@RequestBody CalibrateRequest request) {
        try {
            PrintLog saved = printingService.saveCalibrate(request);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/logsByJobId")
    public ResponseEntity<?> getLogsByJobId(@RequestParam(value = "jobId") Long jobId) {
        try {
            java.util.List<PrintLog> logs = printingService.getLogsByJobId(jobId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/latest-meter")
    public ResponseEntity<?> getLatestMeterByPrinter(@RequestParam(value = "printerId") Integer printerId) {
        try {
            PrintLog log = printingService.getLatestMeterByPrinter(printerId);
            if (log != null) {
                return ResponseEntity.ok(log);
            } else {
                return ResponseEntity.ok(Map.of("notFound", true));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/batchLogs")
    public ResponseEntity<?> getBatchLogs(@RequestBody java.util.List<Long> jobIds) {
        try {
            java.util.Map<Long, java.util.List<PrintLog>> batchLogs = printingService.getBatchLogs(jobIds);
            return ResponseEntity.ok(batchLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchLogs(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "customerJobName", required = false) String customerJobName,
            @RequestParam(value = "issample", required = false) Boolean issample,
            @RequestParam(value = "jobStatus", required = false) String jobStatus,
            @RequestParam(value = "startDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            org.springframework.data.domain.Page<PrintLog> result = printingService.searchLogs(
                    id, jobId, customerJobName, issample, jobStatus, startDate, endDate, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getLogSummary(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "customerJobName", required = false) String customerJobName,
            @RequestParam(value = "issample", required = false) Boolean issample,
            @RequestParam(value = "jobStatus", required = false) String jobStatus,
            @RequestParam(value = "startDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate) {
        try {
            java.util.List<java.util.Map<String, Object>> result = printingService.getLogSummary(
                    id, jobId, customerJobName, issample, jobStatus, startDate, endDate);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/standalone")
    public ResponseEntity<?> getStandaloneLogs(
            @RequestParam(value = "startDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate) {
        try {
            return ResponseEntity.ok(printingService.getStandaloneLogs(startDate, endDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/return-paper")
    public ResponseEntity<?> returnPaper(@RequestBody ReturnPaperRequest request) {
        try {
            printingService.returnPaper(request);
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "คืนสต็อคกระดาษเรียบร้อยแล้ว"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}