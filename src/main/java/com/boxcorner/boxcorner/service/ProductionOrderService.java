package com.boxcorner.boxcorner.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.ProductionOrder;
import com.boxcorner.boxcorner.repository.ProductionOrderRepository;

@Service
public class ProductionOrderService {

    @Autowired
    private ProductionOrderRepository productionOrderRepository;

    @Transactional
    public ProductionOrder save(ProductionOrder productionOrder,String jobOwner) {
        if (productionOrder.getId() == null) {
            productionOrder.setJobOwner(jobOwner);
            productionOrder.setCreatedAt(LocalDate.now());
            productionOrder.setUpdatedAt(LocalDate.now());
            productionOrder.setOperatorName("รอผู้รับผิดชอบยืนยัน");
            productionOrder.setJobStatus("รอผู้รับผิดชอบยืนยัน");
            productionOrder.setProcessStatus("รอผู้รับผิดชอบยืนยัน");
            productionOrder.setMoldStatus("รอผู้รับผิดชอบยืนยัน");
        }
        if (productionOrder.getId() != null) {
            Optional<ProductionOrder> existingOrderOpt = productionOrderRepository.findById(productionOrder.getId());
            if (existingOrderOpt.isPresent()) {
                ProductionOrder existingOrder = existingOrderOpt.get();
                productionOrder.setCreatedAt(existingOrder.getCreatedAt());
                productionOrder.setUpdatedAt(LocalDate.now());
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

    public Page<ProductionOrder> findByProductionFilters(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, Pageable pageable) {
        return productionOrderRepository.findByProductionFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
    }

    public Page<ProductionOrder> findByProductionCheck(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, Pageable pageable) {
        return productionOrderRepository.findProductionCheck(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
    }

    public ProductionOrder updateProcessStatus (Integer id , String processStatus) {
        ProductionOrder existingOrder = productionOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setProcessStatus(processStatus);
        return productionOrderRepository.save(existingOrder);
    }

    public ProductionOrder updateJobStatus (Integer id , String jobStatus) {
        ProductionOrder existingOrder = productionOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setJobStatus(jobStatus);
        return productionOrderRepository.save(existingOrder);
    }

    public ProductionOrder updateMoldStatus (Integer id , String jobStatus) {
        ProductionOrder existingOrder = productionOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setMoldStatus(jobStatus);
        return productionOrderRepository.save(existingOrder);
    }

    public ProductionOrder updatePrintingMachine (Integer id , String printingMachine) {
        ProductionOrder existingOrder = productionOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setPrintingMachine(printingMachine);
        return productionOrderRepository.save(existingOrder);
    }

    public ProductionOrder updateMoldMakerName (Integer id, String name ) {
        ProductionOrder existingOrder = productionOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setMoldMakerName(name);
        return productionOrderRepository.save(existingOrder);
    }

    public Integer countBacklog(String operatorName) {
        return productionOrderRepository.countBacklog(operatorName);
    }

    public Integer countBacklogHPlanning() {
        return productionOrderRepository.countBacklogHPlanning();
    }

    public Integer countBacklogCheck() {
        return productionOrderRepository.countBacklogCheck();
    }

    public Integer countBacklogMold() {
        return productionOrderRepository.countBacklogMold();
    }

}