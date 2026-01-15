package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.ProductionStamping;
import com.boxcorner.boxcorner.repository.ProductionStampingRepository;

@Service
public class ProductionStampingService {

    @Autowired
    private ProductionStampingRepository repository;

    public ProductionStamping create(ProductionStamping stamping) {
        return repository.save(stamping);
    }

    public Page<ProductionStamping> getAll(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
    }

    public ProductionStamping getById(Integer id) {
        return repository.findById(id).orElse(null);
    }
}
