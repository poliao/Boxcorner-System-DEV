package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.UnitStock;
import com.boxcorner.boxcorner.service.UnitStockService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/unit-stock")
@RequiredArgsConstructor
public class UnitStockController {

    private final UnitStockService unitStockService;

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(value = "itemName", required = false) String itemName,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "paperSize", required = false) String paperSize,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        try {
            Page<UnitStock> result = unitStockService.search(itemName, category, paperSize, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam(value = "id") Long id) {
        return unitStockService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody UnitStock paperStock) {
        try {
            UnitStock saved = unitStockService.save(paperStock);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam Long id) {
        try {
            unitStockService.delete(id);
            return ResponseEntity.ok(Map.of("message", "ลบสำเร็จ"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
