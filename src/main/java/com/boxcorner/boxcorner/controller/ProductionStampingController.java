package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.ProductionStamping;
import com.boxcorner.boxcorner.service.ProductionStampingService;

@RestController
@RequestMapping("/api/production-stamping")
@CrossOrigin(origins = "*")
public class ProductionStampingController {

    @Autowired
    private ProductionStampingService service;

    @PostMapping("/create")
    public ResponseEntity<ProductionStamping> create(@RequestBody ProductionStamping stamping) {
        return ResponseEntity.ok(service.create(stamping));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductionStamping>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAll(page, size));
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
