package com.boxcorner.boxcorner.controller;

import java.sql.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.ExtraPrint;
import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.entity.ProductionJob;
import com.boxcorner.boxcorner.entity.PrintLog;
import com.boxcorner.boxcorner.entity.dto.ReturnPaperRequest;
import com.boxcorner.boxcorner.entity.dto.StartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.StopPrintRequest;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.ExtraPrintService;
import com.boxcorner.boxcorner.service.PrintJobService;
import com.boxcorner.boxcorner.service.PrintingService;
import com.boxcorner.boxcorner.service.ProductionJobService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/printing-od")
public class PrintingOdController {

    @Autowired
    private PrintJobService printJobService;

    @Autowired
    private ProductionJobService productionJobService;

    @Autowired
    private PrintingService printingService;

    @Autowired
    private ExtraPrintService extraPrintService;

    @Autowired
    private TokenService tokenService;

    // --- PrintJob ---
    @PostMapping("/print-job/save")
    public ResponseEntity<?> savePrintJob(@RequestBody PrintJob printJob) {
        try {
            return ResponseEntity.ok(printJobService.save(printJob));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/print-job/search")
    public ResponseEntity<Page<PrintJob>> searchPrintJobs(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "customerJobName", required = false) String customerJobName,
            @RequestParam(value = "printerName", required = false) String printerName,
            @RequestParam(value = "startDate", required = false) Date startDate,
            @RequestParam(value = "endDate", required = false) Date endDate,
            @RequestParam(value = "issample", required = false) Boolean issample,
            @RequestParam(value = "jobStatus", required = false) String jobStatus,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        Page<PrintJob> result = printJobService.getAllDetail(
                id,
                jobId,
                customerJobName,
                printerName,
                startDate,
                endDate,
                issample,
                jobStatus,
                null, // meterCategory
                page,
                size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/print-job/getById")
    public ResponseEntity<PrintJob> getPrintJobById(@RequestParam("id") Long id) {
        return printJobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- ProductionJob ---
    @GetMapping("/production-job/getById")
    public ResponseEntity<?> getProductionJobById(@RequestParam("id") Long id) {
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

    @PostMapping("/production-job/save")
    public ResponseEntity<?> saveProductionJob(@RequestBody ProductionJob productionJob) {
        try {
            ProductionJob savedData = productionJobService.save(productionJob);
            return ResponseEntity.ok(savedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving data: " + e.getMessage());
        }
    }

    // --- Printing Log ---
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

    @GetMapping("/logById")
    public ResponseEntity<?> getPrintLog(@RequestParam(value = "logId") Long logId) {
        PrintLog log = printingService.gePrintLog(logId);
        if (log != null) {
            return ResponseEntity.ok(log);
        } else {
            return ResponseEntity.notFound().build();
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

    // --- Extra Print ---
    @GetMapping("/extra-prints/getByPrintJobId")
    public ResponseEntity<?> getExtraPrintsByPrintJobId(@RequestParam("printJobId") Long printJobId) {
        try {
            java.util.List<ExtraPrint> extraPrints = extraPrintService.findByPrintJobId(printJobId);
            return ResponseEntity.ok(extraPrints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/extra-prints/batchByPrintJobIds")
    public ResponseEntity<?> getBatchExtraPrints(@RequestBody java.util.List<Long> printJobIds) {
        try {
            java.util.Map<Long, java.util.List<ExtraPrint>> batchExtraPrints = extraPrintService.getBatchExtraPrints(printJobIds);
            return ResponseEntity.ok(batchExtraPrints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/extra-prints/save")
    public ResponseEntity<?> saveExtraPrint(@RequestBody ExtraPrint extraPrint) {
        try {
            ExtraPrint saved = extraPrintService.save(extraPrint);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // --- Print Log Query (สำหรับ Dcsm29 summary) ---
    @GetMapping("/logsByJobId")
    public ResponseEntity<?> getLogsByJobId(@RequestParam(value = "jobId") Long jobId) {
        try {
            java.util.List<PrintLog> logs = printingService.getLogsByJobId(jobId);
            return ResponseEntity.ok(logs);
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
}
