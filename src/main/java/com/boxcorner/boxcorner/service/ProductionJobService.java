package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.boxcorner.boxcorner.entity.ProductionJob;
import com.boxcorner.boxcorner.entity.PapProductionOrder;
import com.boxcorner.boxcorner.entity.QcJob;
import com.boxcorner.boxcorner.repository.PapProductionOrderRepository;
import com.boxcorner.boxcorner.repository.ProductionJobRepository;
import com.boxcorner.boxcorner.repository.QcJobRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class ProductionJobService {

    @Autowired
    private ProductionJobRepository productionJobRepository;

    @Autowired
    private QcJobRepository qcJobRepository;

    @Autowired
    private PapProductionOrderRepository papProductionOrderRepository;

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
                existing.setQcJobId(productionJob.getQcJobId());
                existing.setQcLocation(productionJob.getQcLocation());
                existing.setPrintJobId(productionJob.getPrintJobId());
                existing.setQcType(productionJob.getQcType());
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
    public ProductionJob findByPapOrderId(Integer papOrderId) {
        return productionJobRepository.findByPapOrderId(papOrderId);
    }

    @Transactional
    public void updateQcDate(Long productionJobId, LocalDate newDate) {
        ProductionJob job = productionJobRepository.findById(productionJobId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลใบงานผลิต (ID: " + productionJobId + ")"));

        // 1. อัปเดตตาราง production_jobs
        job.setQcDate(newDate);
        productionJobRepository.save(job);

        // 2. อัปเดตตาราง qc_jobs ถ้ามี qcJobId
        if (job.getQcJobId() != null) {
            Optional<QcJob> qcJobOpt = qcJobRepository.findById(job.getQcJobId());
            if (qcJobOpt.isPresent()) {
                QcJob qcJob = qcJobOpt.get();
                qcJob.setDeliveryDatetime(newDate);
                qcJobRepository.save(qcJob);
            }
        }

        // 3. อัปเดตตาราง pap_production_orders ถ้ามี papOrderId
        if (job.getPapOrderId() != null) {
            Optional<PapProductionOrder> papOrderOpt = papProductionOrderRepository.findById(Long.valueOf(job.getPapOrderId()));
            if (papOrderOpt.isPresent()) {
                PapProductionOrder papOrder = papOrderOpt.get();
                // อัปเดตทั้ง qcScheduledDate และ deliveryDateTime (หากจำเป็น แต่ในที่นี้เน้น QC)
                papOrder.setQcScheduledDate(newDate);
                papProductionOrderRepository.save(papOrder);
            }
        }
    }
}