package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.dto.OdStartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.OdStopPrintRequest;
import com.boxcorner.boxcorner.service.OdPrintingService;
import com.boxcorner.boxcorner.security.jwt.TokenService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/od-printing")
@RequiredArgsConstructor
public class OdPrintingController {

    private final OdPrintingService odPrintingService;
    private final TokenService tokenService;

    private String getOperatorName(HttpServletRequest request) {
        try {
            return tokenService.getCurrentUser(request);
        } catch(Exception e) {
            return "Unknown";
        }
    }

    @GetMapping("/check-stock")
    public ResponseEntity<?> checkStock(
            @RequestParam(value = "lotId") Integer lotId,
            @RequestParam(value = "requiredSheets") Double requiredSheets) {
        try {
            boolean isEnough = odPrintingService.checkLotStock(lotId, requiredSheets);
            return ResponseEntity.ok(Map.of("isEnough", isEnough));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/available-cut-papers")
    public ResponseEntity<?> getAvailableCutPapers() {
        try {
            return ResponseEntity.ok(odPrintingService.getAvailableCutPapers());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/start")
    public ResponseEntity<?> startOdPrinting(@RequestBody OdStartPrintRequest request, HttpServletRequest httpRequest) {
        try {
            return ResponseEntity.ok(odPrintingService.startOdPrinting(request, getOperatorName(httpRequest)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stopOdPrinting(@RequestBody OdStopPrintRequest request, HttpServletRequest httpRequest) {
        try {
            return ResponseEntity.ok(odPrintingService.stopOdPrinting(request, getOperatorName(httpRequest)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
