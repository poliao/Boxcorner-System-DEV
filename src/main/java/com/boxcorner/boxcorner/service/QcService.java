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
    private final com.boxcorner.boxcorner.repository.QcRemainingDestroyRepository qcRemainingDestroyRepository;
    private final com.boxcorner.boxcorner.repository.QcRemainingDestroyStaffRepository qcRemainingDestroyStaffRepository;

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
                if (qcJob.getJobOwner() != null) {
                    existingJob.setJobOwner(qcJob.getJobOwner());
                }
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
                existingJob.setQcLocation(qcJob.getQcLocation());
                existingJob.setQcType(qcJob.getQcType());
                existingJob.setQcColorMatch(qcJob.getQcColorMatch());
                existingJob.setQcColorConsistency(qcJob.getQcColorConsistency());
                existingJob.setQcInkResidue(qcJob.getQcInkResidue());
                existingJob.setQcInkTransfer(qcJob.getQcInkTransfer());
                existingJob.setQcStains(qcJob.getQcStains());
                existingJob.setQcAlignment(qcJob.getQcAlignment());
                existingJob.setQcScratches(qcJob.getQcScratches());
                existingJob.setQcMixedJobs(qcJob.getQcMixedJobs());
                existingJob.setReorderFromJoId(qcJob.getReorderFromJoId());
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
            String joId, String jobName, String status, String qcType, String qcLocation, String role,
            LocalDate startFrom, LocalDate startTo,
            LocalDate deliveryFrom, LocalDate deliveryTo,
            org.springframework.data.domain.Pageable pageable) {

        String effectiveQcLocation = qcLocation;
        if ("stam".equals(role)) {
            effectiveQcLocation = "ส่งOD";
        } else if ("qc".equals(role)) {
            effectiveQcLocation = "ส่งQC";
        }

        return qcJobRepository.findByFilters(joId, jobName, status, qcType, effectiveQcLocation, startFrom, startTo,
                deliveryFrom,
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
            java.util.List<QcWasteReport> wasteReportList,
            Boolean qcColorMatch, Boolean qcColorConsistency, Boolean qcInkResidue, Boolean qcInkTransfer,
            Boolean qcStains, Boolean qcAlignment, Boolean qcScratches, Boolean qcMixedJobs,
            String qcCaution) {
        QcJob qcJob = qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));

        qcJob.setStatus("เสร็จสิ้น");
        qcJob.setPassedQty(passedQty);
        qcJob.setBundlesPerPack(bundlesPerPack);
        qcJob.setBoxesPerBundle(boxesPerBundle);
        qcJob.setPassedQtyFraction(passedQtyFraction);
        qcJob.setBundlesPerPackFraction(bundlesPerPackFraction);
        qcJob.setPiecesFraction(piecesFraction);

        qcJob.setQcColorMatch(qcColorMatch);
        qcJob.setQcColorConsistency(qcColorConsistency);
        qcJob.setQcInkResidue(qcInkResidue);
        qcJob.setQcInkTransfer(qcInkTransfer);
        qcJob.setQcStains(qcStains);
        qcJob.setQcAlignment(qcAlignment);
        qcJob.setQcScratches(qcScratches);
        qcJob.setQcMixedJobs(qcMixedJobs);
        qcJob.setQcCaution(qcCaution);

        QcJob savedJob = qcJobRepository.save(qcJob);

        LogQc logQc = LogQc.builder()
                .qcJobId(id)
                .operatorName("System")
                .reportDate(LocalDate.now())
                .startTime(LocalTime.now())
                .endTime(LocalTime.now())
                .passedQty(passedQty)
                .bundlesPerPack(bundlesPerPack)
                .boxesPerBundle(boxesPerBundle)
                .passedQtyFraction(passedQtyFraction)
                .bundlesPerPackFraction(bundlesPerPackFraction)
                .piecesFraction(piecesFraction)
                .qcCaution(qcCaution)
                .qcType(qcJob.getQcType())
                .build();
        LogQc savedLog = logQcRepository.save(logQc);

        if (staffList != null && !staffList.isEmpty()) {
            for (com.boxcorner.boxcorner.entity.QcStaff staff : staffList) {
                staff.setQcJobId(id);
                staff.setLogQcId(savedLog.getId());
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

    public Integer partialQc(Integer id, Integer passedQty, Integer bundlesPerPack, Integer boxesPerBundle,
            Integer passedQtyFraction, Integer bundlesPerPackFraction, Integer piecesFraction,
            java.util.List<QcStaff> staffList,
            java.util.List<QcWasteReport> wasteReportList,
            Boolean qcColorMatch, Boolean qcColorConsistency, Boolean qcInkResidue, Boolean qcInkTransfer,
            Boolean qcStains, Boolean qcAlignment, Boolean qcScratches, Boolean qcMixedJobs,
            String qcCaution) {
        QcJob qcJob = qcJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + id));

        // Accumulate the passedQty
        Integer currentPassedQty = qcJob.getPassedQty() != null ? qcJob.getPassedQty() : 0;
        qcJob.setPassedQty(currentPassedQty + passedQty);
        
        // Update packing configuration to the latest
        qcJob.setBundlesPerPack(bundlesPerPack);
        qcJob.setBoxesPerBundle(boxesPerBundle);
        
        // Update fractions to the latest (or should it accumulate? Usually just latest state)
        qcJob.setPassedQtyFraction(passedQtyFraction);
        qcJob.setBundlesPerPackFraction(bundlesPerPackFraction);
        qcJob.setPiecesFraction(piecesFraction);

        qcJob.setQcColorMatch(qcColorMatch);
        qcJob.setQcColorConsistency(qcColorConsistency);
        qcJob.setQcInkResidue(qcInkResidue);
        qcJob.setQcInkTransfer(qcInkTransfer);
        qcJob.setQcStains(qcStains);
        qcJob.setQcAlignment(qcAlignment);
        qcJob.setQcScratches(qcScratches);
        qcJob.setQcMixedJobs(qcMixedJobs);
        qcJob.setQcCaution(qcCaution);

        // DO NOT change status to 'เสร็จสิ้น'
        // qcJob.setStatus("อยู่ระหว่างตรวจ"); 

        QcJob savedJob = qcJobRepository.save(qcJob);

        // Create a new LogQc for this partial submission
        LogQc logQc = LogQc.builder()
                .qcJobId(id)
                .operatorName("System") // Or extract from staff list
                .reportDate(LocalDate.now())
                .startTime(LocalTime.now())
                .endTime(LocalTime.now())
                .passedQty(passedQty) // Save the partial quantity
                .bundlesPerPack(bundlesPerPack)
                .boxesPerBundle(boxesPerBundle)
                .passedQtyFraction(passedQtyFraction)
                .bundlesPerPackFraction(bundlesPerPackFraction)
                .piecesFraction(piecesFraction)
                .qcCaution(qcCaution)
                .qcType(qcJob.getQcType())
                .build();
        LogQc savedLog = logQcRepository.save(logQc);

        if (staffList != null && !staffList.isEmpty()) {
            for (com.boxcorner.boxcorner.entity.QcStaff staff : staffList) {
                staff.setQcJobId(id);
                staff.setLogQcId(savedLog.getId());
                qcStaffRepository.save(staff);
            }
        }

        if (wasteReportList != null && !wasteReportList.isEmpty()) {
            for (com.boxcorner.boxcorner.entity.QcWasteReport waste : wasteReportList) {
                waste.setQcJobId(id);
                qcWasteReportRepository.save(waste);
            }
        }

        return savedLog.getId();
    }

    @Transactional
    public com.boxcorner.boxcorner.entity.QcRemainingDestroy saveRemainingDestroy(
            Integer qcJobId, Integer totalPieces, Integer destroyQty,
            Integer bundlesPerPack, Integer boxesPerBundle,
            Integer destroyQtyFraction, Integer bundlesPerPackFraction, Integer piecesFraction,
            String remarks,
            java.util.List<com.boxcorner.boxcorner.entity.QcRemainingDestroyStaff> staffList) {
        QcJob qcJob = qcJobRepository.findById(qcJobId)
                .orElseThrow(() -> new IllegalArgumentException("QcJob not found with id: " + qcJobId));

        com.boxcorner.boxcorner.entity.QcRemainingDestroy record = com.boxcorner.boxcorner.entity.QcRemainingDestroy
                .builder()
                .qcJobId(qcJobId)
                .totalPieces(totalPieces)
                .destroyQty(destroyQty)
                .bundlesPerPack(bundlesPerPack)
                .boxesPerBundle(boxesPerBundle)
                .destroyQtyFraction(destroyQtyFraction)
                .bundlesPerPackFraction(bundlesPerPackFraction)
                .piecesFraction(piecesFraction)
                .qcType(qcJob.getQcType())
                .remarks(remarks)
                .build();
        com.boxcorner.boxcorner.entity.QcRemainingDestroy savedRecord = qcRemainingDestroyRepository.save(record);

        if (staffList != null && !staffList.isEmpty()) {
            for (com.boxcorner.boxcorner.entity.QcRemainingDestroyStaff staff : staffList) {
                if (staff.getUserName() == null || staff.getUserName().trim().isEmpty()) {
                    continue;
                }
                staff.setQcRemainingDestroyId(savedRecord.getId());
                staff.setQcJobId(qcJobId);
                qcRemainingDestroyStaffRepository.save(staff);
            }
        }

        return savedRecord;
    }

    public java.util.List<com.boxcorner.boxcorner.entity.QcRemainingDestroy> getRemainingDestroyByJob(Integer qcJobId) {
        return qcRemainingDestroyRepository.findByQcJobIdOrderByIdAsc(qcJobId);
    }

    public java.util.Map<String, Long> getQcCounts(String role) {
        String effectiveQcLocation = null;
        if ("stam".equals(role)) {
            effectiveQcLocation = "ส่งOD";
        } else if ("qc".equals(role)) {
            effectiveQcLocation = "ส่งQC";
        }

        long jobsToDo = qcJobRepository.countByStatusInAndQcLocation(
                java.util.Arrays.asList("รอส่งตรวจ", "เข้าตรวจแล้ว", "อยู่ระหว่างตรวจ"),
                effectiveQcLocation);

        long jobsToSend = qcJobRepository.countByStatusNotAndDeliveryDatetimeLessThanEqualAndQcLocation(
                "เสร็จสิ้น",
                LocalDate.now(),
                effectiveQcLocation);

        java.util.Map<String, Long> counts = new java.util.HashMap<>();
        counts.put("jobsToDo", jobsToDo);
        counts.put("jobsToSend", jobsToSend);
        return counts;
    }
}
