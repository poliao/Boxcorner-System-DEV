package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.*;
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
    private final com.boxcorner.boxcorner.repository.QcStaffRepository qcStaffRepository;
    private final com.boxcorner.boxcorner.repository.QcWasteReportRepository qcWasteReportRepository;

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
                existingJob.setPassedQtyFraction(qcJob.getPassedQtyFraction());
                existingJob.setBundlesPerPackFraction(qcJob.getBundlesPerPackFraction());
                existingJob.setQcDetail(qcJob.getQcDetail());
                existingJob.setPiecesFraction(qcJob.getPiecesFraction());
                existingJob.setStartQcDatetime(qcJob.getStartQcDatetime());

                return qcJobRepository.save(existingJob);
            } else {
                return qcJobRepository.save(qcJob);
            }
        } catch (OptimisticLockingFailureException e) {
            throw new IllegalStateException("The QC job was updated by another user. Please refresh and try again.", e);
        }
    }

    @Transactional
    public QcJob startQc(Integer id, Integer receivedQty, String operatorName, String qcType) {
        QcJob qcJob = qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));

        qcJob.setStatus("อยู่ระหว่างตรวจ");
        qcJob.setReceivedQty(receivedQty);
        qcJob.setQcType(qcType);

        QcJob savedJob = qcJobRepository.save(qcJob);
        LogQc logQc = LogQc.builder()
                .qcJobId(id)
                .operatorName(operatorName)
                .reportDate(LocalDate.now())
                .startTime(LocalTime.now())
                .receivedQty(receivedQty)
                .qcType(qcType)
                .build();
        logQcRepository.save(logQc);

        return savedJob;
    }

    public org.springframework.data.domain.Page<QcJob> getAllQcJobs(
            String joId, String jobName, String status, String qcType,
            LocalDate startFrom, LocalDate startTo,
            LocalDate deliveryFrom, LocalDate deliveryTo,
            org.springframework.data.domain.Pageable pageable) {
        return qcJobRepository.findByFilters(joId, jobName, status, qcType, startFrom, startTo, deliveryFrom,
                deliveryTo, pageable);
    }

    public QcJob getQcJobById(Integer id) {
        return qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));
    }

    @Transactional
    public QcJob completeQc(Integer id, Integer passedQty, Integer bundlesPerPack, Integer boxesPerBundle,
            Integer passedQtyFraction, Integer bundlesPerPackFraction, Integer piecesFraction,
            java.util.List<QcStaff> staffList,
            java.util.List<QcWasteReport> wasteReportList) {
        QcJob qcJob = qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));

        qcJob.setStatus("เสร็จสิ้น");
        qcJob.setPassedQty(passedQty);
        qcJob.setBundlesPerPack(bundlesPerPack);
        qcJob.setBoxesPerBundle(boxesPerBundle);
        qcJob.setPassedQtyFraction(passedQtyFraction);
        qcJob.setBundlesPerPackFraction(bundlesPerPackFraction);
        qcJob.setPiecesFraction(piecesFraction);

        QcJob savedJob = qcJobRepository.save(qcJob);

        LogQc logQc = logQcRepository.findTopByQcJobIdOrderByIdDesc(id)
                .orElseThrow(() -> new IllegalArgumentException("LogQc not found for qcJobId: " + id));

        logQc.setEndTime(LocalTime.now());
        logQc.setPassedQty(passedQty);
        logQc.setBundlesPerPack(bundlesPerPack);
        logQc.setBoxesPerBundle(boxesPerBundle);
        logQc.setPassedQtyFraction(passedQtyFraction);
        logQc.setBundlesPerPackFraction(bundlesPerPackFraction);
        logQc.setPiecesFraction(piecesFraction);
        logQcRepository.save(logQc);

        if (staffList != null && !staffList.isEmpty()) {
            for (com.boxcorner.boxcorner.entity.QcStaff staff : staffList) {
                staff.setQcJobId(id);
                qcStaffRepository.save(staff);
            }
        }

        if (wasteReportList != null && !wasteReportList.isEmpty()) {
            for (com.boxcorner.boxcorner.entity.QcWasteReport waste : wasteReportList) {
                waste.setQcJobId(id);
                qcWasteReportRepository.save(waste);
            }
        }

        return savedJob;
    }
}
