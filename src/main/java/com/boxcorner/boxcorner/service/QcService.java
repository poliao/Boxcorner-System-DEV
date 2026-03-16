package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.LogQc;
import com.boxcorner.boxcorner.entity.QcJob;
import com.boxcorner.boxcorner.repository.LogQcRepository;
import com.boxcorner.boxcorner.repository.QcJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class QcService {

    private final QcJobRepository qcJobRepository;
    private final LogQcRepository logQcRepository;

    @Transactional
    public QcJob saveQcJob(QcJob qcJob) {
        try {
            if (qcJob.getId() != null) {
                QcJob existingJob = qcJobRepository.findById(qcJob.getId())
                        .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + qcJob.getId()));

                if (qcJob.getRowVersion() != null) {
                    existingJob.setRowVersion(qcJob.getRowVersion());
                }
                existingJob.setStatus(qcJob.getStatus());
                existingJob.setJoId(qcJob.getJoId());
                existingJob.setJobName(qcJob.getJobName());
                existingJob.setResponsibleName(qcJob.getResponsibleName());
                existingJob.setDeliveryDatetime(qcJob.getDeliveryDatetime());
                existingJob.setProductJobId(qcJob.getProductJobId());
                existingJob.setPapOrderId(qcJob.getPapOrderId());
                existingJob.setReceivedQty(qcJob.getReceivedQty());
                existingJob.setPassedQty(qcJob.getPassedQty());
                existingJob.setBundlesPerPack(qcJob.getBundlesPerPack());
                existingJob.setBoxesPerBundle(qcJob.getBoxesPerBundle());

                return qcJobRepository.save(existingJob);
            } else {
                return qcJobRepository.save(qcJob);
            }
        } catch (OptimisticLockingFailureException e) {
            throw new IllegalStateException("The QC job was updated by another user. Please refresh and try again.", e);
        }
    }

    @Transactional
    public QcJob startQc(Integer id, Integer receivedQty, String operatorName) {
        QcJob qcJob = qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));

        qcJob.setStatus(QcJob.JobStatus.IN_PROGRESS);
        qcJob.setReceivedQty(receivedQty);

        QcJob savedJob = qcJobRepository.save(qcJob);

        // บันทึก LogQc
        LogQc logQc = LogQc.builder()
                .qcJobId(id)
                .operatorName(operatorName)
                .reportDate(LocalDate.now())
                .startTime(LocalTime.now())
                .receivedQty(receivedQty)
                .build();
        logQcRepository.save(logQc);

        return savedJob;
    }

    public org.springframework.data.domain.Page<QcJob> getAllQcJobs(org.springframework.data.domain.Pageable pageable) {
        return qcJobRepository.findAll(pageable);
    }

    public QcJob getQcJobById(Integer id) {
        return qcJobRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));
    }

    @Transactional
    public QcJob completeQc(Integer id, Integer passedQty, Integer bundlesPerPack, Integer boxesPerBundle) {
        QcJob qcJob = qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));

        qcJob.setStatus(QcJob.JobStatus.COMPLETED);
        qcJob.setPassedQty(passedQty);
        qcJob.setBundlesPerPack(bundlesPerPack);
        qcJob.setBoxesPerBundle(boxesPerBundle);
        
        QcJob savedJob = qcJobRepository.save(qcJob);

        // อัพเดต LogQc ล่าสุด
        LogQc logQc = logQcRepository.findTopByQcJobIdOrderByIdDesc(id)
                .orElseThrow(() -> new IllegalArgumentException("LogQc not found for qcJobId: " + id));
        
        logQc.setEndTime(LocalTime.now());
        logQc.setPassedQty(passedQty);
        logQc.setBundlesPerPack(bundlesPerPack);
        logQc.setBoxesPerBundle(boxesPerBundle);
        logQcRepository.save(logQc);

        return savedJob;
    }
}
