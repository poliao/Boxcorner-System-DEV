package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.ProductionCoating;
import com.boxcorner.boxcorner.service.ProductionCoatingService;

@RestController
@RequestMapping("/api/production-coating")
@CrossOrigin(origins = "*")
public class ProductionCoatingController {

    @Autowired
    private ProductionCoatingService service;

    @PostMapping("/create")
    public ResponseEntity<ProductionCoating> create(@RequestBody ProductionCoating coating) {
        return ResponseEntity.ok(service.create(coating));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductionCoating>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    @GetMapping("/getById")
    public ResponseEntity<ProductionCoating> getById(@RequestParam(value = "id") Integer id) {
        ProductionCoating coating = service.getById(id);
        if (coating != null) {
            return ResponseEntity.ok(coating);
        }
        return ResponseEntity.notFound().build();
    }
}
