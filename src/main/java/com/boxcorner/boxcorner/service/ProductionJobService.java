package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.boxcorner.boxcorner.entity.ProductionJob;
import com.boxcorner.boxcorner.repository.ProductionJobRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;

@Service
public class ProductionJobService {

    @Autowired
    private ProductionJobRepository productionJobRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public ProductionJob save(ProductionJob productionJob) {
        if (productionJob.getId() != null) {
            ProductionJob existing = productionJobRepository.findById(productionJob.getId()).orElse(null);
            if (existing != null) {
                if (productionJob.getRowVersion() != null &&
                        !existing.getRowVersion().equals(productionJob.getRowVersion())) {
                    throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
                }

                existing.setDate(productionJob.getDate());
                existing.setJobId(productionJob.getJobId());
                existing.setCustomerJobName(productionJob.getCustomerJobName());
                existing.setPrintQuantity(productionJob.getPrintQuantity());
                existing.setProductionQuantity(productionJob.getProductionQuantity());
                existing.setPrintingDate(productionJob.getPrintingDate());
                existing.setPrintingResponsible(productionJob.getPrintingResponsible());
                existing.setCoatingDate(productionJob.getCoatingDate());
                existing.setCoatingResponsible(productionJob.getCoatingResponsible());
                existing.setCoatingLocation(productionJob.getCoatingLocation());
                existing.setStampingDate(productionJob.getStampingDate());
                existing.setStampingResponsible(productionJob.getStampingResponsible());
                existing.setStampingLocation(productionJob.getStampingLocation());
                existing.setGluingDate(productionJob.getGluingDate());
                existing.setGluingResponsible(productionJob.getGluingResponsible());
                existing.setGluingLocation(productionJob.getGluingLocation());
                existing.setQcDate(productionJob.getQcDate());
                existing.setQcStatus(productionJob.getQcStatus());
                existing.setDueDate(productionJob.getDueDate());
                existing.setPrintStatus(productionJob.getPrintStatus());
                existing.setShippingAddress(productionJob.getShippingAddress());
                existing.setRemark(productionJob.getRemark());
                existing.setDeliveryStatus(productionJob.getDeliveryStatus());
                existing.setImageUrl(productionJob.getImageUrl());
                existing.setMachineSetupCount(productionJob.getMachineSetupCount());
                existing.setPrintingRecordId(productionJob.getPrintingRecordId());
                return productionJobRepository.save(existing);
            }
        }
        return productionJobRepository.save(productionJob);
    }

    public ProductionJob findById(Long id) {
        return productionJobRepository.findById(id).orElse(null);
    }

    public Page<ProductionJob> findAll(Pageable pageable) {
        return productionJobRepository.findAll(pageable);
    }

    public Page<ProductionJob> findByFilters(Long id, String jobId, String customerJobName,
            String printStatus, String deliveryStatus, String coatingLocation, 
            String stampingLocation, String gluingLocation, LocalDate startDate, LocalDate endDate,
            int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.unsorted());
        return productionJobRepository.findByFilters(id, jobId, customerJobName, printStatus,
                deliveryStatus, coatingLocation, stampingLocation, gluingLocation, 
                startDate, endDate, paging);
    }

    public Page<ProductionJob> findByFilters(int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return productionJobRepository.findUndeliveredJobsThisMonth(paging);
    }

    public Page<ProductionJob> findByFiltersPrint(Long id, String jobId, String customerJobName,
            String printStatus, LocalDate startDate, LocalDate endDate,
            int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return productionJobRepository.findByFiltersPrinting(id, jobId, customerJobName, printStatus,
                startDate, endDate, paging);
    }

    public Page<ProductionJob> findByFiltersPrintingOS(Long id, String jobId, String customerJobName,
            String printStatus, LocalDate startDate, LocalDate endDate,
            int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return productionJobRepository.findByFiltersPrintingOS(id, jobId, customerJobName, printStatus,
                startDate, endDate, paging);
    }
}