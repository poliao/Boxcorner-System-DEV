package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.Material;
import com.boxcorner.boxcorner.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    public Page<Material> getAllMaterials(String searchTerm, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return materialRepository.searchMaterials(searchTerm, paging);
    }

    public Optional<Material> getMaterialById(Integer id) {
        return materialRepository.findById(id);
    }

    public Material saveMaterial(Material data) {
        // Handle nulls and default values before calculation
        if (data.getQtyPerBox() == null || data.getQtyPerBox() <= 0) {
            data.setQtyPerBox(1);
        }
        if (data.getCurrentStockLarge() == null) {
            data.setCurrentStockLarge(0);
        }
        if (data.getCurrentStockSmall() == null) {
            data.setCurrentStockSmall(0);
        }

        // Auto-calculate total pieces based on large and small unit inventory
        int calculatedTotal = (data.getCurrentStockLarge() * data.getQtyPerBox()) + data.getCurrentStockSmall();
        data.setTotalStockPices(calculatedTotal);

        return materialRepository.save(data);
    }

    public void deleteMaterial(Integer id) {
        materialRepository.deleteById(id);
    }
}
