package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.*;
import com.boxcorner.boxcorner.service.StockLogService;
import com.boxcorner.boxcorner.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;
    private final StockLogService stockLogService;

    // --- UOM ---
    @GetMapping("/uoms")
    public ResponseEntity<?> getAllUoms() {
        try {
            return ResponseEntity.ok(stockService.getAllUoms());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/uoms")
    public ResponseEntity<?> saveUom(@RequestBody Uom uom) {
        try {
            return ResponseEntity.ok(stockService.saveUom(uom));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/uoms/{id}")
    public ResponseEntity<?> deleteUom(@PathVariable Integer id) {
        try {
            stockService.deleteUom(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // --- Supplier ---
    @GetMapping("/suppliers")
    public ResponseEntity<?> getAllSuppliers() {
        try {
            return ResponseEntity.ok(stockService.getAllSuppliers());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/suppliers")
    public ResponseEntity<?> saveSupplier(@RequestBody Supplier supplier) {
        try {
            return ResponseEntity.ok(stockService.saveSupplier(supplier));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Integer id) {
        try {
            stockService.deleteSupplier(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/brands")
    public ResponseEntity<?> getAllBrands() {
        try {
            return ResponseEntity.ok(stockService.getAllBrands());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/brands")
    public ResponseEntity<?> saveBrand(@RequestBody Brand brand) {
        try {
            return ResponseEntity.ok(stockService.saveBrand(brand));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Integer id) {
        try {
            stockService.deleteBrand(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // --- Material ---
    @GetMapping("/materials")
    public ResponseEntity<?> getAllMaterials() {
        try {
            return ResponseEntity.ok(stockService.getAllMaterials());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/materials/{id}")
    public ResponseEntity<?> getMaterialById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(stockService.getMaterialById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/materials")
    public ResponseEntity<?> saveMaterial(@RequestBody Material material) {
        try {
            return ResponseEntity.ok(stockService.saveMaterial(material));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Integer id) {
        try {
            stockService.deleteMaterial(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // --- Material Conversion ---
    @GetMapping("/material-conversions")
    public ResponseEntity<?> getAllMaterialConversions() {
        try {
            return ResponseEntity.ok(stockService.getAllMaterialConversions());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/material-conversions/{id}")
    public ResponseEntity<?> getMaterialConversionById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(stockService.getMaterialConversionById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/material-conversions/material/{materialId}")
    public ResponseEntity<?> getMaterialConversionsByMaterialId(@PathVariable Integer materialId) {
        try {
            return ResponseEntity.ok(stockService.getMaterialConversionsByMaterialId(materialId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/material-conversions")
    public ResponseEntity<?> saveMaterialConversion(@RequestBody MaterialConversion conversion) {
        try {
            return ResponseEntity.ok(stockService.saveMaterialConversion(conversion));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/material-conversions/{id}")
    public ResponseEntity<?> deleteMaterialConversion(@PathVariable Integer id) {
        try {
            stockService.deleteMaterialConversion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // --- Lot ---
    @GetMapping("/lots")
    public ResponseEntity<?> getAllLots() {
        try {
            return ResponseEntity.ok(stockService.getAllLots());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/lots/{id}")
    public ResponseEntity<?> getLotById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(stockService.getLotById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/lots/material/{materialId}")
    public ResponseEntity<?> getLotsByMaterialId(@PathVariable Integer materialId) {
        try {
            return ResponseEntity.ok(stockService.getLotsByMaterialId(materialId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping("/lots")
    public ResponseEntity<?> saveLot(@RequestBody Lot lot) {
        try {
            return ResponseEntity.ok(stockService.saveLot(lot));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/lots/{id}")
    public ResponseEntity<?> deleteLot(@PathVariable Integer id) {
        try {
            stockService.deleteLot(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // --- Inventory ---
    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory() {
        try {
            return ResponseEntity.ok(stockService.getInventory());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/lots/{lotId}/logs")
    public ResponseEntity<Page<StockLog>> getLotLogs(
            @PathVariable Integer lotId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(stockLogService.getStockLogs(null, lotId, page, size));
    }
}
