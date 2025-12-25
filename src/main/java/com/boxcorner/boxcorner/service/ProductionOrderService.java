package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.ProductionOrder;
import com.boxcorner.boxcorner.repository.ProductionOrderRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class ProductionOrderService {

    @Autowired
    private ProductionOrderRepository productionOrderRepository;

    @Transactional
    public ProductionOrder save(ProductionOrder productionOrder) {
        if (productionOrder.getId() != null) {
            Optional<ProductionOrder> existingOrderOpt = productionOrderRepository.findById(productionOrder.getId());
            if (existingOrderOpt.isPresent()) {
                ProductionOrder existingOrder = existingOrderOpt.get();
                productionOrder.setCreatedAt(existingOrder.getCreatedAt());
            }
        }
        return productionOrderRepository.save(productionOrder);
    }

    public ProductionOrder findById(Integer id) {
        return productionOrderRepository.findById(id).orElse(null);
    }

    public Page<ProductionOrder> findByFilters(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, Pageable pageable) {
        return productionOrderRepository.findByFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
    }
}