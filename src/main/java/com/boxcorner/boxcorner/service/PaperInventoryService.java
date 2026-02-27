package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.PaperInventory;
import com.boxcorner.boxcorner.repository.PaperInventoryRepository;
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
    public PaperInventory save(PaperInventory inv) {
        return paperInventoryRepository.save(inv);
    }

    @Transactional
    public void delete(Long id) {
        paperInventoryRepository.deleteById(id);
    }
}
