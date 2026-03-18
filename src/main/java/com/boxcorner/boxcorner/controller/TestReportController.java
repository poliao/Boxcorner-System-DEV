package com.boxcorner.boxcorner.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.service.JasperService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test-report")
@RequiredArgsConstructor
public class TestReportController {

    private final JasperService jasperService;

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> testPdf(@RequestBody Map<String, Object> parameters) {
        try {
            byte[] pdf = jasperService.generatePdfReportWithDbConnection(
                    "reports/" + parameters.get("reportName") + ".jrxml",
                    parameters);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + parameters.get("reportName") + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            Throwable root = e;
            while (root.getCause() != null && root != root.getCause()) {
                root = root.getCause();
            }
            String errorMessage = "Error: " + e.getMessage();
            if (root != e) {
                errorMessage += " | Root Cause: " + root.getMessage();
            }
            return ResponseEntity.internalServerError().body(errorMessage.getBytes());
        }
    }
}
