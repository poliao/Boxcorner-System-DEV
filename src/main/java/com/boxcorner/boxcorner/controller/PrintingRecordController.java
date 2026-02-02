package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.PrintingRecord;
import com.boxcorner.boxcorner.service.PrintingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/printing-records")
public class PrintingRecordController {

    @Autowired
    private PrintingRecordService printingRecordService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrintingRecord printingRecord, HttpServletRequest httpRequest) {
        try {
            PrintingRecord saved = printingRecordService.save(printingRecord);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam("id") Integer id) {
        try {
            return printingRecordService.findById(id).<ResponseEntity<?>>map(record -> ResponseEntity.ok(record)).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Record not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving data: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<PrintingRecord>> getAllRecords() {
        List<PrintingRecord> records = printingRecordService.findAll();
        return ResponseEntity.ok(records);
    }

    @DeleteMapping("/deleteById")
    public ResponseEntity<Void> delete(@RequestParam("id") Integer id) {
        printingRecordService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}