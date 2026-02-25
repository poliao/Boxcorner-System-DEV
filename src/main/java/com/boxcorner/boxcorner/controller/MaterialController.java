package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.Material;
import com.boxcorner.boxcorner.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping("/list")
    public ResponseEntity<?> getAllMaterials(
            @RequestParam(value = "searchTerm", required = false, defaultValue = "") String searchTerm,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            Page<Material> pageResult = materialService.getAllMaterials(searchTerm, page, size);
            return ResponseEntity.ok(pageResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getMaterialById(@RequestParam("id") Integer id) {
        try {
            Optional<Material> material = materialService.getMaterialById(id);
            if (material.isPresent()) {
                return ResponseEntity.ok(material.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Material not found");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveMaterial(@RequestBody Material material) {
        try {
            Material saved = materialService.saveMaterial(material);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMaterial(@RequestParam("id") Integer id) {
        try {
            materialService.deleteMaterial(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
