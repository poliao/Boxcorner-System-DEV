package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.PrintLogOs;
import com.boxcorner.boxcorner.service.PrintLogOsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/print-log-os")
@RequiredArgsConstructor
public class PrintLogOsController {

    private final PrintLogOsService printLogOsService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrintLogOs printLogOs) {
        try {
            PrintLogOs saved = printLogOsService.save(printLogOs);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving print log: " + e.getMessage());
        }
    }

    @PostMapping("/create-from-checklist/{jobId}")
    public ResponseEntity<?> createFromChecklist(
            @PathVariable("jobId") Long jobId,
            @RequestBody PrintLogOs checklistData) {
        try {
            PrintLogOs saved = printLogOsService.createFromChecklist(jobId, checklistData);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating print log from checklist: " + e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getByJobId(@PathVariable("jobId") Long jobId) {
        try {
            List<PrintLogOs> logs = printLogOsService.findByJobId(jobId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching print logs: " + e.getMessage());
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam(value = "logId") Long logId) {
        try {
            PrintLogOs log = printLogOsService.findById(logId);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Print log not found: " + e.getMessage());
        }
    }
}
