package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.ExtraPrint;
import com.boxcorner.boxcorner.service.ExtraPrintService;

import java.util.List;

@RestController
@RequestMapping("/api/extra-prints")
public class ExtraPrintController {

    @Autowired
    private ExtraPrintService extraPrintService;

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam("id") Long id) {
        try {
            return extraPrintService.findById(id)
                    .<ResponseEntity<?>>map(extraPrint -> ResponseEntity.ok(extraPrint))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบข้อมูล"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/getByPrintJobId")
    public ResponseEntity<?> getByPrintJobId(@RequestParam("printJobId") Long printJobId) {
        try {
            List<ExtraPrint> extraPrints = extraPrintService.findByPrintJobId(printJobId);
            return ResponseEntity.ok(extraPrints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ExtraPrint extraPrint) {
        try {
            ExtraPrint saved = extraPrintService.save(extraPrint);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam("id") Long id) {
        try {
            extraPrintService.deleteById(id);
            return ResponseEntity.ok("ลบข้อมูลสำเร็จ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
