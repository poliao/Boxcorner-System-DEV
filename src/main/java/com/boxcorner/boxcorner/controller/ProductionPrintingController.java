package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.ProductionPrinting;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.ProductionPrintingService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/production-printing")
@CrossOrigin(origins = "*")
public class ProductionPrintingController {

    @Autowired
    private ProductionPrintingService service;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/create")
    public ResponseEntity<ProductionPrinting> create(@RequestBody ProductionPrinting printing, HttpServletRequest request) {
        return ResponseEntity.ok(service.create(printing, tokenService.getCurrentUser(request)));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductionPrinting>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "jobOrderNo", required = false) String jobOrderNo,
            @RequestParam(value = "jobName", required = false) String jobName) {
        return ResponseEntity.ok(service.getAll(page, size, id, jobOrderNo, jobName));
    }

    @GetMapping("/getById")
    public ResponseEntity<ProductionPrinting> getById(@RequestParam(value = "id") Integer id) {
        ProductionPrinting printing = service.getById(id);
        if (printing != null) {
            return ResponseEntity.ok(printing);
        }
        return ResponseEntity.notFound().build();
    }
}
