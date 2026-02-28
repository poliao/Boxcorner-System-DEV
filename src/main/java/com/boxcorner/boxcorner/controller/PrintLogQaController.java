package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.PrintLogQa;
import com.boxcorner.boxcorner.service.PrintLogQaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/print-log-qa")
@RequiredArgsConstructor
public class PrintLogQaController {

    private final PrintLogQaService printLogQaService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrintLogQa qcData) {
        try {
            PrintLogQa saved = printLogQaService.save(qcData);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving QA check: " + e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getByJobId(@PathVariable Long jobId) {
        try {
            List<PrintLogQa> logs = printLogQaService.findByJobId(jobId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching QA checks: " + e.getMessage());
        }
    }
}
