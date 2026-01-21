package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.ProductionCoating;
import com.boxcorner.boxcorner.repository.ProductionCoatingRepository;

@Service
public class ProductionCoatingService {

    @Autowired
    private ProductionCoatingRepository repository;

    public ProductionCoating save(ProductionCoating coating, String username) {
        coating.setReporterName(username);
        return repository.save(coating);
    }

    public Page<ProductionCoating> getAll(int page, int size, String id, String jobOrderNo, String jobName) {
        if ((id == null || id.trim().isEmpty()) && 
            (jobOrderNo == null || jobOrderNo.trim().isEmpty()) && 
            (jobName == null || jobName.trim().isEmpty())) {
            return repository.findAll(PageRequest.of(page, size));
        }
        return repository.findByFilters(id, jobOrderNo, jobName, PageRequest.of(page, size));
    }

    public ProductionCoating getById(Integer id) {
        return repository.findById(id).orElse(null);
    }
}
