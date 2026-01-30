package com.boxcorner.boxcorner.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.SampleOrder;
import com.boxcorner.boxcorner.repository.SampleOrderRepository;

@Service
public class SampleOrderService {

    @Autowired
    private SampleOrderRepository sampleOrderRepository;

    @Transactional
    public SampleOrder saveOrUpdateOrder(SampleOrder order, String jobOwner) {
        
        if (order.getId() != null) {
            return sampleOrderRepository.findById(order.getId())
                .map(existingOrder -> {
                    existingOrder.setOrderDate(order.getOrderDate());
                    existingOrder.setFolderName(order.getFolderName());
                    existingOrder.setJobOwner(order.getJobOwner());
                    existingOrder.setDeliveryDate(order.getDeliveryDate());
                    existingOrder.setDeliveryTime(order.getDeliveryTime());
                    existingOrder.setResponsiblePerson(order.getResponsiblePerson());
                    existingOrder.setQuantity(order.getQuantity());
                    existingOrder.setUnit(order.getUnit());
                    existingOrder.setIsCreateSample(order.getIsCreateSample());
                    existingOrder.setStatus(order.getStatus());
                    existingOrder.setNote(order.getNote());
                    existingOrder.setUpdateDateDelivery(order.getUpdateDateDelivery());
                    existingOrder.setUpdateTimeDelivery(order.getUpdateTimeDelivery());
                    existingOrder.setCancelRemarks(order.getCancelRemarks());
                    
                    return sampleOrderRepository.save(existingOrder);
                })
                .orElseGet(() -> {
                   
                    return sampleOrderRepository.save(order);
                });
        }else{
             order.setJobOwner(jobOwner);
        }
        return sampleOrderRepository.save(order);
    }

    @Transactional
    public Page<SampleOrder> getAll(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFilters(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    @Transactional
    public Page<SampleOrder> getAllSort(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersSort(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    public Optional<SampleOrder> getSampleOrderById(Integer id) {
        return sampleOrderRepository.findById(id);
    }

    @Transactional
    public Page<SampleOrder> getAllDetail(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersDetail(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    @Transactional
    public Page<SampleOrder> getAllDetailSort(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersDetailSort(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    @Transactional
    public Page<SampleOrder> getAllDetailBack(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersDetailBack(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    @Transactional
    public Page<SampleOrder> getAllDetailBackSort(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersDetailBackSort(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    public SampleOrder updatesampleOrderStatus(int id, String status, String assignee) {
        SampleOrder sampleOrder = sampleOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        if (assignee != null) {
            sampleOrder.setResponsiblePerson(assignee);
        }
        sampleOrder.setStatus(status);
        return sampleOrderRepository.save(sampleOrder);
    }

    public SampleOrder updatesampleOrderNoteEdit(Integer id, String note) {
        SampleOrder sampleOrder = sampleOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Design ID: " + id));
        sampleOrder.setNoteEdit(note);
        return sampleOrderRepository.save(sampleOrder);
    }

    public Integer countBacklogStatus(String status ,String responsiblePerson) {
        return sampleOrderRepository.countBacklogStatus(status,responsiblePerson);
    }

    public Integer countStatus(String status) {
        return sampleOrderRepository.countStatus(status);
    }

    public Integer countBacklogSalesStatus(String status ,String jobOwner) {
        return sampleOrderRepository.countBacklogSalesStatus(status,jobOwner);
    }

    @Transactional
    public Page<SampleOrder> getAllVerify(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersVerify(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }

    @Transactional
    public Page<SampleOrder> getAllVerifySort(Integer id, String folderName, String jobOwner, String responsiblePerson, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return sampleOrderRepository.findByFiltersVerifySort(
            id,
            folderName,
            jobOwner,
            responsiblePerson,
            status, 
            startDate,
            endDate,
            paging
        );
    }
}