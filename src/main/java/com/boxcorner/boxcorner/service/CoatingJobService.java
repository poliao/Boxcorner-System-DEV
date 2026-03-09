package com.boxcorner.boxcorner.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.BaseEntity;
import com.boxcorner.boxcorner.entity.CoatingJob;
import com.boxcorner.boxcorner.repository.CoatingJobRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class CoatingJobService {

    @Autowired
    private CoatingJobRepository coatingJobRepository;

    @Transactional
    public CoatingJob createCoatingJob(CoatingJob coatingJob) {

        if (coatingJobRepository.existsByJoId(coatingJob.getJoId())) {
            throw new RuntimeException("มีงานเคลือบของ JO นี้ในระบบอยู่แล้ว: " + coatingJob.getJoId());
        }

        if (coatingJob.getOrderDatetime() == null) {
            coatingJob.setOrderDatetime(LocalDateTime.now());
        }

        if (coatingJob.getStatus() == null) {
            coatingJob.setStatus(BaseEntity.JobStatus.PENDING);
        }

        return coatingJobRepository.save(coatingJob);
    }

    @Transactional
    public CoatingJob updateStatus(int id, BaseEntity.JobStatus status) {
        CoatingJob job = coatingJobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบงานเคลือบ id=" + id));
        job.setStatus(status);
        return coatingJobRepository.save(job);
    }

    public Page<CoatingJob> getCoatingJobsWithSearch(
            String joId,
            String jobCustomerName,
            String jobOwnerName,
            String technicianName,
            Pageable pageable) {
        return coatingJobRepository.findByFilters(
                joId,
                jobCustomerName,
                jobOwnerName,
                technicianName,
                pageable);
    }

    public java.util.Optional<CoatingJob> getCoatingJobById(int id) {
        return coatingJobRepository.findById(id);
    }
}
