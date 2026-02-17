package com.boxcorner.boxcorner.service;

import java.time.LocalDate;
import java.time.LocalTime;

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
    public ProductionOrder save(ProductionOrder productionOrder, String jobOwner) {
        if (productionOrder.getId() != null) {
            ProductionOrder existingOrder = productionOrderRepository.findById(productionOrder.getId())
                    .orElseThrow(
                            () -> new RuntimeException("ไม่พบข้อมูลสำหรับการอัปเดต ID: " + productionOrder.getId()));

            if (productionOrder.getRowVersion() != null
                    && !existingOrder.getRowVersion().equals(productionOrder.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            existingOrder.setFolderName(productionOrder.getFolderName());
            existingOrder.setUsedFile(productionOrder.getUsedFile());
            existingOrder.setColorSample(productionOrder.getColorSample());
            existingOrder.setJobOwner(productionOrder.getJobOwner());
            existingOrder.setDeadlineDate(productionOrder.getDeadlineDate());
            existingOrder.setDeadlineTime(productionOrder.getDeadlineTime());
            existingOrder.setDeliveryDate(productionOrder.getDeliveryDate());
            existingOrder.setJobStatus(productionOrder.getJobStatus());
            existingOrder.setProcessStatus(productionOrder.getProcessStatus());
            existingOrder.setOperatorName(productionOrder.getOperatorName());
            existingOrder.setInspectionDate(productionOrder.getInspectionDate());
            existingOrder.setRemarks(productionOrder.getRemarks());
            existingOrder.setMoldStatus(productionOrder.getMoldStatus());
            existingOrder.setJobType(productionOrder.getJobType());
            existingOrder.setMoldMakerName(productionOrder.getMoldMakerName());
            existingOrder.setPrintingMachine(productionOrder.getPrintingMachine());
            existingOrder.setInspector(productionOrder.getInspector());
            existingOrder.setPostpone(productionOrder.getPostpone());
            existingOrder.setCustomerName(productionOrder.getCustomerName());
            existingOrder.setDataDalivery(productionOrder.getDataDalivery());
            existingOrder.setCancelRemarks(productionOrder.getCancelRemarks());

            existingOrder.setUpdatedAt(LocalDate.now());
            existingOrder.setJobId(productionOrder.getJobId());
            existingOrder.setQtId(productionOrder.getQtId());
            existingOrder.setDecisionAuthority(productionOrder.getDecisionAuthority());


            return productionOrderRepository.save(existingOrder);
        } else {
            productionOrder.setJobOwner(jobOwner);
            productionOrder.setCreatedAt(LocalDate.now());
            productionOrder.setUpdatedAt(LocalDate.now());
            productionOrder.setOperatorName("รอผู้รับผิดชอบยืนยัน");
            productionOrder.setJobStatus("รอผู้รับผิดชอบยืนยัน");
            productionOrder.setProcessStatus("รอผู้รับผิดชอบยืนยัน");
            productionOrder.setMoldStatus("รอผู้รับผิดชอบยืนยัน");
            return productionOrderRepository.save(productionOrder);
        }
    }

    public ProductionOrder findById(Integer id) {
        return productionOrderRepository.findById(id).orElse(null);
    }

    public ProductionOrder updateDataDalivery(Integer id , Boolean processStatus) {
        ProductionOrder existingOrder = productionOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        existingOrder.setDataDalivery(processStatus);
        return productionOrderRepository.save(existingOrder);
    }

    public Page<ProductionOrder> findByFilters(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, String postpone, Pageable pageable) {
        return productionOrderRepository.findByFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, postpone, pageable);
    }

    public Page<ProductionOrder> findByFiltersSort(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, String postpone, Pageable pageable) {
        return productionOrderRepository.findByFiltersSort(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, postpone, pageable);
    }

    public Page<ProductionOrder> findByProductionFilters(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, Pageable pageable) {
        return productionOrderRepository.findByProductionFilters(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
    }

    public Page<ProductionOrder> findByProductionFiltersSort(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, Pageable pageable) {
        return productionOrderRepository.findByProductionFiltersSort(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, pageable);
    }

    public Page<ProductionOrder> findByProductionCheck(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, String inspector, Boolean dataDelivery, Pageable pageable) {
        return productionOrderRepository.findProductionCheck(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, inspector, dataDelivery, pageable);
    }

    public Page<ProductionOrder> findByProductionCheckSort(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, String inspector, Pageable pageable) {
        return productionOrderRepository.findProductionCheckSort(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, inspector, pageable);
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

    public Integer countBacklogProcessStatus(String processStatus, String operatorName) {
        return productionOrderRepository.countBacklogProcessStatus(processStatus, operatorName);
    }

    public Integer countBacklogProcessStatus(String processStatus) {
        return productionOrderRepository.countBacklogProcessStatus(processStatus);
    }

    public Integer countBacklogDelivery() {
        return productionOrderRepository.countBacklogDelivery();
    }

    public Integer countBacklogMoldStatus(String moldStatus) {
        return productionOrderRepository.countBacklogMoldStatus(moldStatus);
    }

    public Integer countBacklogSupplier(String username) {
        return productionOrderRepository.countBacklogSupplier(username);
    }

    public Integer countBacklogKeepSupplier(String username) {
        return productionOrderRepository.countBacklogKeepSupplier(username);
    }

    public Integer countBacklogPostpone(String username) {
        return productionOrderRepository.countBacklogPostpone(username);
    }

    public Integer countBacklogMachine() {
        return productionOrderRepository.countBacklogMachine();
    }

    public Page<ProductionOrder> findByFiltersSample(Integer id, String folderName, String jobOwner,
            LocalDate startDate, LocalDate endDate, LocalTime deadlineTime,
            String jobStatus, String processStatus, String operatorName,
            String moldStatus, String jobType, String postpone, Pageable pageable) {
        return productionOrderRepository.findByFiltersSample(
                id, folderName, jobOwner, startDate, endDate, deadlineTime,
                jobStatus, processStatus, operatorName, moldStatus, jobType, postpone, pageable);
    }
}