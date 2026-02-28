package com.boxcorner.boxcorner.service;

import lombok.NonNull;
import com.boxcorner.boxcorner.entity.PaperInventory;
import com.boxcorner.boxcorner.entity.UnitStock;
import com.boxcorner.boxcorner.repository.PaperInventoryRepository;
import com.boxcorner.boxcorner.repository.UnitStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaperInventoryService {

    private final PaperInventoryRepository paperInventoryRepository;
    private final UnitStockRepository unitStockRepository;
    private final StockLogService stockLogService;

    public Page<PaperInventory> search(String itemName, String category, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("inventory_id").descending());
        Page<Object[]> rawPage = paperInventoryRepository.findByFiltersRaw(itemName, category, pageable);

        List<PaperInventory> mapped = new ArrayList<>();
        for (Object[] row : rawPage.getContent()) {
            PaperInventory pi = new PaperInventory();
            pi.setInventoryId(row[0] != null ? ((Number) row[0]).longValue() : null);
            pi.setUnitStockId(row[1] != null ? ((Number) row[1]).longValue() : null);
            pi.setCurrentMajorQty(row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO);
            pi.setCurrentMinorQty(row[3] != null ? (BigDecimal) row[3] : BigDecimal.ZERO);
            pi.setWarehouseLocation(row[4] != null ? row[4].toString() : null);
            // row[5] = last_updated, row[6] = row_version
            pi.setItemName(row[7] != null ? row[7].toString() : "");
            pi.setCategory(row[8] != null ? row[8].toString() : "");
            pi.setPaperSize(row[9] != null ? row[9].toString() : "");
            pi.setMajorUnit(row[10] != null ? row[10].toString() : "");
            pi.setMinorUnit(row[11] != null ? row[11].toString() : "");
            mapped.add(pi);
        }
        return new PageImpl<>(mapped, pageable, rawPage.getTotalElements());
    }

    public Optional<PaperInventory> getById(Long id) {
        return paperInventoryRepository.findById(id);
    }

    @Transactional
    public PaperInventory save(PaperInventory inv, String operatorName) {
        BigDecimal oldMajor = BigDecimal.ZERO;
        BigDecimal oldMinor = BigDecimal.ZERO;

        if (inv.getInventoryId() != null) {
            Optional<PaperInventory> exist = paperInventoryRepository.findById(inv.getInventoryId().longValue());
            if (exist.isPresent()) {
                oldMajor = exist.get().getCurrentMajorQty() != null ? exist.get().getCurrentMajorQty()
                        : BigDecimal.ZERO;
                oldMinor = exist.get().getCurrentMinorQty() != null ? exist.get().getCurrentMinorQty()
                        : BigDecimal.ZERO;
            }
        }

        PaperInventory saved = paperInventoryRepository.save(inv);

        BigDecimal newMajor = saved.getCurrentMajorQty() != null ? saved.getCurrentMajorQty() : BigDecimal.ZERO;
        BigDecimal newMinor = saved.getCurrentMinorQty() != null ? saved.getCurrentMinorQty() : BigDecimal.ZERO;

        if (oldMajor.compareTo(newMajor) != 0 || oldMinor.compareTo(newMinor) != 0) {
            UnitStock unitStock = null;
            if (saved.getUnitStockId() != null) {
                unitStock = unitStockRepository.findById(saved.getUnitStockId().longValue()).orElse(null);
            }
            BigDecimal sheetsPerReam = BigDecimal.ONE;
            if (unitStock != null && unitStock.getMinorQuantity() != null && unitStock.getMajorQuantity() != null
                    && unitStock.getMajorQuantity().compareTo(BigDecimal.ZERO) > 0) {
                sheetsPerReam = unitStock.getMinorQuantity().divide(unitStock.getMajorQuantity(), 2,
                        java.math.RoundingMode.HALF_UP);
            }

            BigDecimal oldTotal = oldMajor.multiply(sheetsPerReam).add(oldMinor);
            BigDecimal newTotal = newMajor.multiply(sheetsPerReam).add(newMinor);

            BigDecimal diffTotal = newTotal.subtract(oldTotal);
            com.boxcorner.boxcorner.entity.StockLog.TransactionType type;
            if (diffTotal.compareTo(BigDecimal.ZERO) > 0) {
                type = com.boxcorner.boxcorner.entity.StockLog.TransactionType.IN;
            } else {
                type = com.boxcorner.boxcorner.entity.StockLog.TransactionType.ADJUST;
                diffTotal = diffTotal.abs(); // Store absolute value
            }

            // Calculate diff major/minor for log
            BigDecimal[] divAndRem = diffTotal.divideAndRemainder(sheetsPerReam);

            com.boxcorner.boxcorner.entity.StockLog log = com.boxcorner.boxcorner.entity.StockLog.builder()
                    .unitStockId(saved.getUnitStockId())
                    .transactionType(type)
                    .quantityMajor(divAndRem[0])
                    .quantityMinor(divAndRem[1])
                    .totalSheets(diffTotal.intValue())
                    .operatorName(operatorName)
                    .note(inv.getTransactionNote() != null ? inv.getTransactionNote()
                            : (type == com.boxcorner.boxcorner.entity.StockLog.TransactionType.IN ? "เพิ่มสต็อคกระดาษ"
                                    : "ปรับปรุงสต็อคกระดาษ"))
                    .build();
            stockLogService.logTransaction(log);
        }

        return saved;
    }

    @Transactional
    public void delete(@NonNull Long id) {
        paperInventoryRepository.deleteById(id);
    }

    public boolean checkStock(@NonNull Long unitStockId, BigDecimal requiredSheets) {
        // Find the paper inventory by unitStockId
        Optional<PaperInventory> inventoryOpt = paperInventoryRepository.findByUnitStockId(unitStockId);
        if (inventoryOpt.isEmpty()) {
            return false; // No inventory record = 0 stock
        }

        PaperInventory inventory = inventoryOpt.get();

        // Find the unit stock to get the conversion rate
        Optional<UnitStock> unitStockOpt = unitStockRepository.findById(unitStockId);
        if (unitStockOpt.isEmpty()) {
            return false;
        }

        UnitStock unitStock = unitStockOpt.get();
        BigDecimal minorPerMajor = unitStock.getMinorQuantity();
        if (minorPerMajor == null || minorPerMajor.compareTo(BigDecimal.ZERO) == 0) {
            minorPerMajor = BigDecimal.ONE; // default to 1 if not set
        }

        // Calculate total available sheets (minor units)
        BigDecimal totalAvailableSheets = inventory.getCurrentMinorQty()
                .add(inventory.getCurrentMajorQty().multiply(minorPerMajor));

        return totalAvailableSheets.compareTo(requiredSheets) >= 0;
    }
}
