package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.service.JasperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/test-report")
@RequiredArgsConstructor
public class TestReportController {

    private final JasperService jasperService;

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> testPdf() {
        try {
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("jobId", "JO6903-0125_7530");

            byte[] pdf = jasperService.generatePdfReport("reports/QcReport.jrxml", parameters);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=QcReport.pdf")
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
