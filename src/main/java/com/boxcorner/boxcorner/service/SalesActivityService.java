package com.boxcorner.boxcorner.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.SalesActivity;
import com.boxcorner.boxcorner.repository.SalesActivityRepository;

@Service
public class SalesActivityService {

    @Autowired
    private SalesActivityRepository salesActivityRepository;

    @Transactional
    public SalesActivity saveOrUpdate(SalesActivity activity, String salesName) {
        if (activity.getActivityId() != null) {
            SalesActivity existing = salesActivityRepository.findById(activity.getActivityId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล ID: " + activity.getActivityId()));
            
            if (activity.getRowVersion() != null && !existing.getRowVersion().equals(activity.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }
            
            existing.setActivityDate(activity.getActivityDate());
            existing.setCustomerName(activity.getCustomerName());
            existing.setContactPerson(activity.getContactPerson());
            existing.setContactChannel(activity.getContactChannel());
            existing.setObjective(activity.getObjective());
            existing.setDiscussionResult(activity.getDiscussionResult());
            existing.setIsNewCustomer(activity.getIsNewCustomer());
            existing.setNextStep(activity.getNextStep());
            existing.setContact(activity.getContact());
            existing.setQuotation(activity.getQuotation());
            existing.setSalesName(activity.getSalesName());
            existing.setNextDate(activity.getNextDate());
            existing.setNextTime(activity.getNextTime());
            existing.setCompanyName(activity.getCompanyName());
            
            return salesActivityRepository.save(existing);
        } else {
            activity.setSalesName(salesName);
            return salesActivityRepository.save(activity);
        }
    }

    @Transactional
    public Page<SalesActivity> search(
            Long activityId,
            String customerName,
            String contactPerson,
            Boolean isNewCustomer,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) {
        Pageable paging = PageRequest.of(page, size);
        return salesActivityRepository.findByFilters(
            activityId,
            customerName,
            contactPerson,
            isNewCustomer,
            startDate,
            endDate,
            paging
        );
    }

    public Optional<SalesActivity> getById(Long id) {
        return salesActivityRepository.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        salesActivityRepository.deleteById(id);
    }
}
