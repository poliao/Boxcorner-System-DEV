package com.boxcorner.boxcorner.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.PrintLog;
import com.boxcorner.boxcorner.entity.dto.CalibrateRequest;
import com.boxcorner.boxcorner.entity.dto.StartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.StopPrintRequest;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.PrintingService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/printing")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // อนุญาตให้ Frontend ยิงเข้ามาได้ทุก Domain (Dev Mode)
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

}