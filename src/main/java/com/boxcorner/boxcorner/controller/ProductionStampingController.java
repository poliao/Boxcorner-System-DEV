package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.ProductionStamping;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.ProductionStampingService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/production-stamping")
public class ProductionStampingController {

    @Autowired
    private ProductionStampingService service;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/create")
    public ResponseEntity<ProductionStamping> create(@RequestBody ProductionStamping stamping, HttpServletRequest request) {
        return ResponseEntity.ok(service.save(stamping,tokenService.getCurrentUser(request)));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductionStamping>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "jobOrderNo", required = false) String jobOrderNo,
            @RequestParam(value = "jobName", required = false) String jobName) {
        return ResponseEntity.ok(service.getAll(page, size, id, jobOrderNo, jobName));
    }

    @GetMapping("/getById")
    public ResponseEntity<ProductionStamping> getById(@RequestParam(value = "id") Integer id) {
        ProductionStamping stamping = service.getById(id);
        if (stamping != null) {
            return ResponseEntity.ok(stamping);
        }
        return ResponseEntity.notFound().build();
    }
}
