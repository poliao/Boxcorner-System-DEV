package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.UnitStock;
import com.boxcorner.boxcorner.repository.UnitStockRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnitStockService {

    private final UnitStockRepository unitStockRepository;

    public Page<UnitStock> search(String itemName, String category, String paperSize, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return unitStockRepository.findByFilters(itemName, category, paperSize, pageable);
    }

    public Optional<UnitStock> getById(Long id) {
        return unitStockRepository.findById(id);
    }

    @Transactional
    public UnitStock save(UnitStock unitStock) {
        return unitStockRepository.save(unitStock);
    }

    @Transactional
    public void delete(Long id) {
        unitStockRepository.deleteById(id);
    }
}
