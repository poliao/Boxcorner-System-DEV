package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.ProductionPrinting;
import com.boxcorner.boxcorner.repository.ProductionPrintingRepository;

@Service
public class ProductionPrintingService {

    @Autowired
    private ProductionPrintingRepository repository;

    public ProductionPrinting create(ProductionPrinting printing, String username) {
        printing.setReporterName(username);
        return repository.save(printing);
    }

    public Page<ProductionPrinting> getAll(int page, int size, String id, String jobOrderNo, String jobName) {
        if ((id == null || id.trim().isEmpty()) && 
            (jobOrderNo == null || jobOrderNo.trim().isEmpty()) && 
            (jobName == null || jobName.trim().isEmpty())) {
            return repository.findAll(PageRequest.of(page, size));
        }
        return repository.findByFilters(id, jobOrderNo, jobName, PageRequest.of(page, size));
    }

    public ProductionPrinting getById(Integer id) {
        return repository.findById(id).orElse(null);
    }
}
