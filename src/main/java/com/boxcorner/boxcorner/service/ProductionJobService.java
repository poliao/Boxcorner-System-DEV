package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.boxcorner.boxcorner.entity.ProductionJob;
import com.boxcorner.boxcorner.repository.ProductionJobRepository;
import java.time.LocalDate;

@Service
public class ProductionJobService {

    @Autowired
    private ProductionJobRepository productionJobRepository;

    @Transactional
    public ProductionJob save(ProductionJob productionJob) {
        return productionJobRepository.save(productionJob);
    }

    public ProductionJob findById(Long id) {
        return productionJobRepository.findById(id).orElse(null);
    }

    public Page<ProductionJob> findAll(Pageable pageable) {
        return productionJobRepository.findAll(pageable);
    }

    public Page<ProductionJob> findByFilters(Long id, String jobId, String customerJobName, 
                                           String printStatus, LocalDate startDate, LocalDate endDate, 
                                           Pageable pageable) {
        return productionJobRepository.findByFilters(id, jobId, customerJobName, printStatus, 
                                                   startDate, endDate, pageable);
    }
}