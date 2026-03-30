package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.PaperInventory;
import com.boxcorner.boxcorner.entity.UnitStock;
import com.boxcorner.boxcorner.repository.UnitStockRepository;
import com.boxcorner.boxcorner.service.PaperInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paper-inventory")
@RequiredArgsConstructor
public class PaperInventoryController {

    private final PaperInventoryService paperInventoryService;
    private final UnitStockRepository unitStockRepository;

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(value = "itemName", required = false) String itemName,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        try {
            Page<PaperInventory> result = paperInventoryService.search(itemName, category, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam(value = "id") Long id) {
        return paperInventoryService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PaperInventory inv) {
        try {
            PaperInventory saved = paperInventoryService.save(inv, inv.getOperatorName());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam(value = "id") Long id) {
        try {
            paperInventoryService.delete(id);
            return ResponseEntity.ok(Map.of("message", "ลบสำเร็จ"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** สำหรับ dropdown เลือก unit_stock ในหน้า detail */
    @GetMapping("/unit-stock-list")
    public ResponseEntity<?> getUnitStockList() {
        try {
            List<UnitStock> list = unitStockRepository.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/unit-stock-list-available")
    public ResponseEntity<?> getAvailableUnitStockList() {
        try {
            return ResponseEntity.ok(paperInventoryService.getAvailableUnitStockDTOs());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** สำหรับ dropdown เลือกเฉพาะฟิล์มที่ยังมีสต็อคคงเหลือ */
    @GetMapping("/film-stock-available")
    public ResponseEntity<?> getFilmStockAvailable() {
        try {
            List<UnitStock> list = unitStockRepository.findFilmStockAvailable();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** เช็คว่ากระดาษพอหรือไม่ก่อนเริ่มพิมพ์ */
    @GetMapping("/check-stock")
    public ResponseEntity<?> checkStock(
            @RequestParam(value = "unitStockId") Long unitStockId,
            @RequestParam(value = "requiredSheets") java.math.BigDecimal requiredSheets) {
        try {
            boolean isEnough = paperInventoryService.checkStock(unitStockId, requiredSheets);
            return ResponseEntity.ok(Map.of("isEnough", isEnough));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
