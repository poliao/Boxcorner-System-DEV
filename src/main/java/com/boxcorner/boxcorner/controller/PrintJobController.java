package com.boxcorner.boxcorner.controller;

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

import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.service.PrintJobService;

@RestController
@RequestMapping("/api/print-job")
public class PrintJobController {

    @Autowired
    private PrintJobService printJobService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrintJob printJob) {
        try {
            return ResponseEntity.ok(printJobService.save(printJob));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PrintJob>> getAllVerify(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "customerJobName", required = false) String customerJobName,
            @RequestParam(value = "printerName", required = false) String printerName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortByDeadline", required = false) Boolean sortByDeadline) {
        Page<PrintJob> result;
        result = printJobService.getAllDetail(
                id,
                jobId,
                customerJobName,
                printerName,
                page,
                size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getById")
    public ResponseEntity<PrintJob> getById(@RequestParam("id") Long id) {
        return printJobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
