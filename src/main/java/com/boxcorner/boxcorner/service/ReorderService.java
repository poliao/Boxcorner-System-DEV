package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.*;
import com.boxcorner.boxcorner.entity.dto.JoHistoryDTO;
import com.boxcorner.boxcorner.entity.dto.ReorderDTO;
import com.boxcorner.boxcorner.entity.dto.ReorderDesignRequest;
import com.boxcorner.boxcorner.entity.dto.ReorderSampleRequest;
import com.boxcorner.boxcorner.entity.dto.ReorderProductionRequest;
import com.boxcorner.boxcorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReorderService {

    private final ProductionOrderRepository productionOrderRepo;
    private final DesignOrdersRepository designOrdersRepo;
    private final SampleOrderRepository sampleOrderRepo;
    private final PrintJobRepository printJobRepo;
    private final PrintLogRepository printLogRepo;
    private final CoatingJobRepository coatingJobRepo;
    private final CoatingLogRepository coatingLogRepo;
    private final ProductionStampingRepository stampingRepo;
    private final QcJobRepository qcJobRepo;
    private final LogQcRepository logQcRepo;
    private final PrintLogQaRepository printLogQaRepo;
    private final QcWasteReportRepository qcWasteReportRepo;
    private final PrintLogOsRepository printLogOsRepo;
    private final QcStaffRepository qcStaffRepo;
    private final ProductionJobRepository productionJobRepo;

    public Page<ReorderDTO> search(String jobId, String folderName, String customerName,
            String jobOwner, String jobStatus, String processStatus,
            LocalDate startDate, LocalDate endDate, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "job_id"));
        Page<ProductionOrder> orders = productionOrderRepo.findLatestByFilters(
                null, jobId, folderName, jobOwner, startDate, endDate,
                null, jobStatus, processStatus, null, null, null, null, pageable);

        List<ReorderDTO> dtos = orders.getContent().stream().map(o -> {
            ReorderDTO dto = buildDTO(o, false);
            if (o.getJobId() != null) {
                List<ProductionOrder> rounds = productionOrderRepo.findByJobIdOrderByIdDesc(o.getJobId());
                dto.setTotalOrders((int) rounds.size());
                dto.setProofFailedCount(
                        (int) rounds.stream().filter(r -> Boolean.TRUE.equals(r.getIsNewProof())).count());
                dto.setCancelledCount((int) rounds.stream()
                        .filter(r -> "ยกเลิก".equals(r.getJobStatus()) || "ยกเลิก".equals(r.getProcessStatus()))
                        .count());
            }
            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, orders.getTotalElements());
    }

    public ReorderDTO getDetail(Integer productionOrderId) {
        ProductionOrder order = productionOrderRepo.findById(productionOrderId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล Production Order id: " + productionOrderId));
        return buildDTO(order, true);
    }

    private ReorderDTO buildDTO(ProductionOrder order, boolean includeSiblings) {
        ReorderDTO dto = new ReorderDTO();

        // === Production Order - ทุก field ===
        dto.setProductionOrderId(order.getId());
        dto.setJobId(order.getJobId());
        dto.setQtId(order.getQtId());
        dto.setQpId(order.getQpId());
        dto.setFolderName(order.getFolderName());
        dto.setCustomerName(order.getCustomerName());
        dto.setJobOwner(order.getJobOwner());
        dto.setJobType(order.getJobType());
        dto.setJobStatus(order.getJobStatus());
        dto.setProcessStatus(order.getProcessStatus());
        dto.setOperatorName(order.getOperatorName());
        dto.setInspector(order.getInspector());
        dto.setMoldStatus(order.getMoldStatus());
        dto.setMoldMakerName(order.getMoldMakerName());
        dto.setPrintingMachine(order.getPrintingMachine());
        dto.setPostpone(order.getPostpone());
        dto.setUsedFile(order.getUsedFile());
        dto.setColorSample(order.getColorSample());
        dto.setDecisionAuthority(order.getDecisionAuthority());
        dto.setDecisionAuthorityRemarks(order.getDecisionAuthorityRemarks());
        dto.setCancelRemarks(order.getCancelRemarks());
        dto.setRemarks(order.getRemarks());
        dto.setDeadlineDate(order.getDeadlineDate());
        dto.setDeadlineTime(order.getDeadlineTime());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setInspectionDate(order.getInspectionDate());
        dto.setCreatedTime(order.getCreatedTime());
        dto.setProductionOrderCreatedAt(order.getCreatedAt());
        dto.setProductionOrderUpdatedAt(order.getUpdatedAt());
        dto.setDataDalivery(order.getDataDalivery());
        dto.setCustomerFeedback(order.getCustomerFeedback());
        dto.setPrint2Page(order.getPrint2Page());
        dto.setIsNewProof(order.getIsNewProof());
        dto.setPrintRound(order.getPrintRound());
        dto.setPrintRoundPage2(order.getPrintRoundPage2());
        dto.setQcType(order.getQcType());
        dto.setQcLocation(order.getQcLocation());
        dto.setProdSampleJobType(order.getSampleJobType());
        dto.setProdSamplePrintingSystem(order.getSamplePrintingSystem());
        dto.setProdSamplePrintingStyle(order.getSamplePrintingStyle());
        dto.setProdSamplePrintingColor(order.getSamplePrintingColor());
        dto.setProdSamplePaperSize(order.getSamplePaperSize());
        dto.setProdSamplePaperGrammage(order.getSamplePaperGrammage());
        dto.setProdSampleCoatingStyle(order.getSampleCoatingStyle());
        dto.setProdSampleDiecutStyle(order.getSampleDiecutStyle());
        dto.setProdSampleSpecialInstructions(order.getSampleSpecialInstructions());
        dto.setProdSampleDeliveryTimestamp(order.getSampleDeliveryTimestamp());

        // === Design Order ===
        if (order.getQtId() != null && !order.getQtId().isBlank()) {
            designOrdersRepo.findByAll(null, null, null, null, null,
                    order.getQtId(), null, null, null, null, null, null,
                    PageRequest.of(0, 1))
                    .getContent().stream().findFirst().ifPresent(d -> {
                        dto.setDesignOrderId(d.getId());
                        dto.setDesignOrderDate(d.getOrderDate());
                        dto.setDesignOrderTime(d.getOrderTime());
                        dto.setDesignFolderName(d.getFolderName());
                        dto.setDesignJobDetails(d.getJobDetails());
                        dto.setDesignJobOwner(d.getJobOwner());
                        dto.setDesignCustomerName(d.getCustomerName());
                        dto.setDesignAssignee(d.getAssignee());
                        dto.setDesignAssigneeFirst(d.getAssigneeFirst());
                        dto.setDesignDeadlineDate(d.getDeadlineDate());
                        dto.setDesignDeadlineTime(d.getDeadlineTime());
                        dto.setDesignProcessStatus(d.getProcessStatus());
                        dto.setDesignConfirmStatus(d.getConfirmStatus());
                        dto.setDesignConfirmDate(d.getConfirmDate());
                        dto.setDesignFileName(d.getFileName());
                        dto.setDesignNoteEdit(d.getNoteEdit());
                        dto.setDesignRemarks(d.getRemarks());
                        dto.setDesignRemarkAdd(d.getRemarkAdd());
                        dto.setDesignVersion(d.getVersion());
                        dto.setDesignJoId(d.getJoId());
                        dto.setDesignQtId(d.getQtId());
                        dto.setDesignQpId(d.getQpId());
                        dto.setDesignStartDatetime(d.getStartDatetime());
                        dto.setDesignEndDatetime(d.getEndDatetime());
                        if (d.getStartDatetime() != null && d.getEndDatetime() != null) {
                            dto.setDesignDurationMinutes(
                                    ChronoUnit.MINUTES.between(d.getStartDatetime(), d.getEndDatetime()));
                        }
                    });
        }

        // === Sample Order ===
        if (order.getSampleOrderId() != null) {
            sampleOrderRepo.findById(order.getSampleOrderId()).ifPresent(s -> {
                dto.setSampleOrderId(s.getId());
                dto.setSampleOrderDate(s.getOrderDate());
                dto.setSampleOrderTime(s.getOrderTime());
                dto.setSampleFolderName(s.getFolderName());
                dto.setSampleJobOwner(s.getJobOwner());
                dto.setSampleCustomerName(s.getCustomerName());
                dto.setSampleResponsiblePerson(s.getResponsiblePerson());
                dto.setSampleStatus(s.getStatus());
                dto.setSampleDeliveryDate(s.getDeliveryDate());
                dto.setSampleDeliveryTime(s.getDeliveryTime());
                dto.setSampleUpdateDateDelivery(s.getUpdateDateDelivery());
                dto.setSampleUpdateTimeDelivery(s.getUpdateTimeDelivery());
                dto.setSampleQuantity(s.getQuantity());
                dto.setSampleUnit(s.getUnit());
                dto.setSampleIsCreateSample(s.getIsCreateSample());
                dto.setSampleNote(s.getNote());
                dto.setSampleNoteEdit(s.getNoteEdit());
                dto.setSampleCancelRemarks(s.getCancelRemarks());
                dto.setSampleFileName(s.getFileName());
                dto.setSampleJobType(s.getJobType());
                dto.setSamplePrintType(s.getPrintType());
                dto.setSamplePaperType(s.getPaperType());
                dto.setSampleDiecuttingType(s.getDiecuttingType());
                dto.setSampleCoatType(s.getCoatType());
                dto.setSampleSystemPrint(s.getSystemPrint());
                dto.setSampleColorPrint(s.getColorPrint());
                dto.setSamplePaperGram(s.getPaperGram());
                dto.setSampleJobId(s.getJobId());
                dto.setSampleQtId(s.getQtId());
                dto.setSampleQpId(s.getQpId());
                dto.setSamplePrint2Page(s.getPrint2Page());
                dto.setSampleTotalPrintSheets(s.getTotalPrintSheets());
                dto.setSampleCreatedAt(s.getCreatedAt());
                dto.setSampleUpdatedAt(s.getUpdatedAt());
                if (s.getOrderDate() != null && s.getDeliveryDate() != null) {
                    dto.setSampleDurationDays(ChronoUnit.DAYS.between(s.getOrderDate(), s.getDeliveryDate()));
                }
            });
        }

        // === Print Job ===
        if (order.getPrintJobId() != null) {
            printJobRepo.findById(order.getPrintJobId()).ifPresent(pj -> {
                dto.setPrintJobId(pj.getId());
                dto.setPrintJobJobId(pj.getJobId());
                dto.setPrintJobCustomerJobName(pj.getCustomerJobName());
                dto.setPrintJobStatus(pj.getJobStatus());
                dto.setPrintJobType(pj.getJobType());
                dto.setPrintJobPrintType(pj.getPrintType());
                dto.setPrintJobPaperType(pj.getPaperType());
                dto.setPrintJobDiecuttingType(pj.getDiecuttingType());
                dto.setPrintJobCoatType(pj.getCoatType());
                dto.setPrintJobSystemPrint(pj.getSystemPrint());
                dto.setPrintJobColorPrint(pj.getColorPrint());
                dto.setPrintJobPaperGram(pj.getPaperGram());
                dto.setPrintJobPrinterName(pj.getPrinterName());
                dto.setPrintJobSampleRefNo(pj.getSampleRefNo());
                dto.setPrintJobDecisionAuthority(pj.getDecisionAuthority());
                dto.setPrintJobDecisionAuthorityRemarks(pj.getDecisionAuthorityRemarks());
                dto.setPrintJobTypeJob(pj.getTypeJob());
                dto.setTotalPrintSheets(pj.getTotalPrintSheets());
                dto.setProductionQty(pj.getProductionQty());
                dto.setSetupWaste(pj.getSetupWaste());
                dto.setPrintRoundCurrent(pj.getCurrentRound());
                dto.setPrintJobGoodQty(pj.getGoodQty());
                dto.setPrintJobWasteQty(pj.getWasteQty());
                dto.setPrintJobIsSample(pj.getIssample());
                dto.setPrintJobPrint2Page(pj.getPrint2Page());
                dto.setPrintDeliveryDate(pj.getDeliveryDate());
                dto.setPrintDeliveryTime(pj.getDeliveryTime());
                dto.setPrintJobCreatedAt(pj.getCreatedAt());

                List<PrintLog> logs = printLogRepo.findByJobIdOrderByStartedAtDesc(pj.getId());
                dto.setPrintLogs(logs.stream().map(pl -> {
                    ReorderDTO.PrintLogSummary pls = new ReorderDTO.PrintLogSummary();
                    pls.setId(pl.getId());
                    pls.setStartedAt(pl.getStartedAt());
                    pls.setEndedAt(pl.getEndedAt());
                    pls.setOperatorName(pl.getOperatorName());
                    pls.setTotalSheetsUsed(pl.getTotalSheetsUsed());
                    pls.setGoodQty(pl.getGoodQty());
                    pls.setWasteQty(pl.getWasteQty());
                    pls.setPaperReqStart(pl.getPaperReqStart());
                    pls.setPaperReqEnd(pl.getPaperReqEnd());
                    pls.setNote(pl.getNote());
                    if (pl.getLogType() != null)
                        pls.setLogType(pl.getLogType().name());
                    if (pl.getPrintSide() != null)
                        pls.setPrintSide(pl.getPrintSide().name());
                    if (pl.getStartedAt() != null && pl.getEndedAt() != null) {
                        pls.setDurationMinutes(ChronoUnit.MINUTES.between(pl.getStartedAt(), pl.getEndedAt()));
                    }
                    return pls;
                }).collect(Collectors.toList()));

                List<PrintLogQa> qas = printLogQaRepo.findByJobIdOrderByCreatedAtDesc(pj.getId());
                dto.setPrintLogQas(qas.stream().map(qa -> {
                    ReorderDTO.PrintLogQaSummary qasum = new ReorderDTO.PrintLogQaSummary();
                    qasum.setId(qa.getId());
                    qasum.setQcColorMatch(qa.getQcColorMatch());
                    qasum.setQcColorConsistency(qa.getQcColorConsistency());
                    qasum.setQcInkResidue(qa.getQcInkResidue());
                    qasum.setQcInkTransfer(qa.getQcInkTransfer());
                    qasum.setQcStains(qa.getQcStains());
                    qasum.setQcAlignment(qa.getQcAlignment());
                    qasum.setQcScratches(qa.getQcScratches());
                    qasum.setQcMixedJobs(qa.getQcMixedJobs());
                    qasum.setPrintedSheetNumber(qa.getPrintedSheetNumber());
                    qasum.setQcRemark(qa.getQcRemark());
                    qasum.setOperatorName(qa.getOperatorName());
                    qasum.setCreatedAt(qa.getCreatedAt());
                    return qasum;
                }).collect(Collectors.toList()));

                List<PrintLogOs> osLogs = printLogOsRepo.findByJobId(pj.getId());
                dto.setPrintLogOss(osLogs.stream().map(os -> {
                    ReorderDTO.PrintLogOsSummary ossum = new ReorderDTO.PrintLogOsSummary();
                    ossum.setId(os.getId());
                    ossum.setStartTime(os.getStartTime());
                    ossum.setEndTime(os.getEndTime());
                    ossum.setOperatorName(os.getOperatorName());
                    ossum.setMachineName(os.getMachineName());
                    ossum.setStatus(os.getStatus() != null ? os.getStatus().name() : null);
                    ossum.setPrintSide(os.getPrintSide());

                    // Process parameters
                    ossum.setTempFountain(os.getTempFountain());
                    ossum.setIpaPercent(os.getIpaPercent());
                    ossum.setConductivity(os.getConductivity());
                    ossum.setAirPressure(os.getAirPressure());
                    ossum.setPaperBrightness(os.getPaperBrightness());

                    // Ink flags
                    ossum.setFlagHasCmyk(os.getFlagHasCmyk());
                    ossum.setFlagSpecialColor(os.getFlagSpecialColor());
                    ossum.setFlagInkNew(os.getFlagInkNew());
                    ossum.setFlagInkOld(os.getFlagInkOld());

                    // Ink details
                    ossum.setCLot(os.getCLot());
                    ossum.setCBrand(os.getCBrand());
                    ossum.setMLot(os.getMLot());
                    ossum.setMBrand(os.getMBrand());
                    ossum.setYLot(os.getYLot());
                    ossum.setYBrand(os.getYBrand());
                    ossum.setKLot(os.getKLot());
                    ossum.setKBrand(os.getKBrand());

                    // Equipment & References
                    ossum.setCheckPlateCondition(os.getCheckPlateCondition());
                    ossum.setCheckBlanketCondition(os.getCheckBlanketCondition());
                    ossum.setCheckMachineWashed(os.getCheckMachineWashed());
                    ossum.setRefProof(os.getRefProof());
                    ossum.setRefDigital(os.getRefDigital());
                    ossum.setRefOldJob(os.getRefOldJob());
                    ossum.setRefNotSerious(os.getRefNotSerious());

                    ossum.setQcRemark(os.getQcRemark());
                    ossum.setTotalProduct(os.getTotalProduct());
                    if (os.getStartTime() != null && os.getEndTime() != null) {
                        ossum.setDurationMinutes(ChronoUnit.MINUTES.between(os.getStartTime(), os.getEndTime()));
                    }
                    return ossum;
                }).collect(Collectors.toList()));
            });
        }

        // === Coating Job ===
        if (order.getJobId() != null) {
            coatingJobRepo.findByJoId(order.getJobId()).stream().findFirst().ifPresent(cj -> {
                dto.setCoatingJobId(cj.getId());
                dto.setCoatingJoId(cj.getJoId());
                dto.setCoatingJobCustomerName(cj.getJobCustomerName());
                dto.setCoatingJobOwnerName(cj.getJobOwnerName());
                dto.setCoatingStatus(cj.getStatus() != null ? cj.getStatus().name() : null);
                dto.setCoatingTechnicianName(cj.getTechnicianName());
                dto.setCoatingReceivedSheetsQty(cj.getReceivedSheetsQty());
                dto.setCoatingRequiredSheetsQty(cj.getRequiredSheetsQty());
                dto.setCoatingIsSample(cj.getIsSample());
                dto.setCoatingOrderDatetime(cj.getOrderDatetime());
                dto.setCoatingDeliveryDatetime(cj.getDeliveryDatetime());

                List<CoatingLog> clogs = coatingLogRepo.findByCoatingJobIdOrderByIdAsc(cj.getId());
                dto.setCoatingLogs(clogs.stream().map(cl -> {
                    ReorderDTO.CoatingLogSummary cs = new ReorderDTO.CoatingLogSummary();
                    cs.setId(cl.getId());
                    cs.setReportDate(cl.getReportDate());
                    cs.setStartTime(cl.getStartTime());
                    cs.setEndTime(cl.getEndTime());
                    cs.setCoatingType(cl.getCoatingType());
                    cs.setLaminatingTemp(cl.getLaminatingTemp());
                    cs.setFilmStockName(cl.getFilmStockName());
                    cs.setPaperLength(cl.getPaperLength());
                    cs.setSheetQty(cl.getSheetQty());
                    cs.setTechnicianName(cl.getTechnicianName());
                    cs.setRemarks(cl.getRemarks());
                    if (cl.getStartTime() != null && cl.getEndTime() != null) {
                        cs.setDurationMinutes(ChronoUnit.MINUTES.between(cl.getStartTime(), cl.getEndTime()));
                    }
                    return cs;
                }).collect(Collectors.toList()));
            });
        }

        // === Stamping ===
        if (order.getJobId() != null) {
            List<ProductionStamping> stampings = stampingRepo.findByJobOrderNo(order.getJobId());
            dto.setStampingLogs(stampings.stream().map(st -> {
                ReorderDTO.StampingSummary ss = new ReorderDTO.StampingSummary();
                ss.setId(st.getId());
                ss.setReportDate(st.getReportDate());
                ss.setStartTime(st.getStartTime());
                ss.setEndTime(st.getEndTime());
                ss.setTotalTime(st.getTotalTime());
                ss.setQuantity(st.getQuantity());
                ss.setStampingType(st.getStampingType());
                ss.setReporterName(st.getReporterName());
                ss.setRemarks(st.getRemarks());
                return ss;
            }).collect(Collectors.toList()));
        }

        // === QC Job ===
        if (order.getJobId() != null) {
            qcJobRepo.findByJoId(order.getJobId()).stream().findFirst().ifPresent(qj -> {
                dto.setQcJobId(qj.getId());
                dto.setQcJobJoId(qj.getJoId());
                dto.setQcJobName(qj.getJobName());
                dto.setQcJobResponsibleName(qj.getResponsibleName());
                dto.setQcStatus(qj.getStatus());
                dto.setQcJobType(qj.getQcType());
                dto.setQcJobDetail(qj.getQcDetail());
                dto.setQcJobPartName(qj.getPartName());
                dto.setQcJobLocation(qj.getQcLocation());
                dto.setQcStartDate(qj.getStartQcDatetime());
                dto.setQcDeliveryDate(qj.getDeliveryDatetime());
                dto.setQcReceivedQty(qj.getReceivedQty());
                dto.setQcPassedQty(qj.getPassedQty());
                dto.setQcBundlesPerPack(qj.getBundlesPerPack());
                dto.setQcBoxesPerBundle(qj.getBoxesPerBundle());
                dto.setQcPassedQtyFraction(qj.getPassedQtyFraction());
                dto.setQcBundlesPerPackFraction(qj.getBundlesPerPackFraction());
                dto.setQcPiecesFraction(qj.getPiecesFraction());

                List<LogQc> qcLogs = logQcRepo.findByQcJobIdOrderByIdAsc(qj.getId());
                dto.setQcLogs(qcLogs.stream().map(lq -> {
                    ReorderDTO.QcLogSummary qs = new ReorderDTO.QcLogSummary();
                    qs.setId(lq.getId());
                    qs.setReportDate(lq.getReportDate());
                    qs.setStartTime(lq.getStartTime());
                    qs.setEndTime(lq.getEndTime());
                    qs.setReceivedQty(lq.getReceivedQty());
                    qs.setPassedQty(lq.getPassedQty());
                    qs.setFailedQty(lq.getFailedQty());
                    qs.setBundlesPerPack(lq.getBundlesPerPack());
                    qs.setBoxesPerBundle(lq.getBoxesPerBundle());
                    qs.setPassedQtyFraction(lq.getPassedQtyFraction());
                    qs.setBundlesPerPackFraction(lq.getBundlesPerPackFraction());
                    qs.setPiecesFraction(lq.getPiecesFraction());
                    qs.setQcType(lq.getQcType());
                    qs.setOperatorName(lq.getOperatorName());
                    qs.setRemarks(lq.getRemarks());
                    if (lq.getStartTime() != null && lq.getEndTime() != null) {
                        qs.setDurationMinutes(ChronoUnit.MINUTES.between(lq.getStartTime(), lq.getEndTime()));
                    }
                    return qs;
                }).collect(Collectors.toList()));

                List<QcWasteReport> wastes = qcWasteReportRepo.findByQcJobId(qj.getId());
                dto.setQcWasteReports(wastes.stream().map(w -> {
                    ReorderDTO.QcWasteReportSummary s = new ReorderDTO.QcWasteReportSummary();
                    s.setId(w.getId());
                    s.setQcJobId(w.getQcJobId());
                    s.setProcessName(w.getProcessName());
                    s.setTechnicianName(w.getTechnicianName());
                    s.setWasteQty(w.getWasteQty());
                    s.setRemarks(w.getRemarks());
                    return s;
                }).collect(Collectors.toList()));

                List<QcStaff> staffs = qcStaffRepo.findByQcJobId(qj.getId());
                dto.setQcStaffs(staffs.stream().map(qs -> {
                    ReorderDTO.QcStaffSummary s = new ReorderDTO.QcStaffSummary();
                    s.setId(qs.getId());
                    s.setQcJobId(qs.getQcJobId());
                    s.setUserName(qs.getUserName());
                    s.setPacks(qs.getPacks());
                    s.setPacksFraction(qs.getPacksFraction());
                    s.setBundlesFraction(qs.getBundlesFraction());
                    s.setPiecesFraction(qs.getPiecesFraction());
                    return s;
                }).collect(Collectors.toList()));
            });
        }

        // === ระยะเวลารวม ===
        if (order.getCreatedAt() != null) {
            LocalDate endDay = (order.getDeliveryDate() != null) ? order.getDeliveryDate() : LocalDate.now();
            dto.setTotalDurationDays(ChronoUnit.DAYS.between(order.getCreatedAt().toLocalDate(), endDay));
        }

        if (includeSiblings && order.getJobId() != null) {
            List<ProductionOrder> siblings = productionOrderRepo.findByJobIdOrderByIdDesc(order.getJobId());
            dto.setSiblingOrders(siblings.stream()
                    .filter(s -> !s.getId().equals(order.getId()))
                    .map(s -> buildDTO(s, false))
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    // ═══════════════════════════════════════════════════════════════
    // JO History (grouped by job_id)
    // ═══════════════════════════════════════════════════════════════
    public JoHistoryDTO getJobHistory(String jobId) {
        List<ProductionOrder> allOrders = productionOrderRepo.findByJobIdOrderByIdDesc(jobId);
        if (allOrders.isEmpty()) {
            throw new RuntimeException("ไม่พบข้อมูลสำหรับ Job ID: " + jobId);
        }

        JoHistoryDTO result = new JoHistoryDTO();
        ProductionOrder primaryOrder = allOrders.get(0);

        result.setJobId(jobId);
        result.setFolderName(primaryOrder.getFolderName());
        result.setCustomerName(primaryOrder.getCustomerName());
        result.setJobOwner(primaryOrder.getJobOwner());
        result.setQtId(primaryOrder.getQtId());
        result.setQpId(primaryOrder.getQpId());
        result.setTotalRounds(allOrders.size());
        result.setProofFailedCount(
                (int) allOrders.stream().filter(o -> Boolean.TRUE.equals(o.getIsNewProof())).count());
        result.setCancelledCount((int) allOrders.stream()
                .filter(o -> "ยกเลิก".equals(o.getJobStatus()) || "ยกเลิก".equals(o.getProcessStatus())).count());

        // Design Order (from qt_id of primary)
        if (primaryOrder.getQtId() != null && !primaryOrder.getQtId().isBlank()) {
            designOrdersRepo.findByAll(null, null, null, null, null,
                    primaryOrder.getQtId(), null, null, null, null, null, null,
                    PageRequest.of(0, 1)).getContent().stream().findFirst().ifPresent(d -> {
                        JoHistoryDTO.DesignOrderSummary ds = new JoHistoryDTO.DesignOrderSummary();
                        ds.setId(d.getId());
                        ds.setOrderDate(d.getOrderDate());
                        ds.setOrderTime(d.getOrderTime());
                        ds.setFolderName(d.getFolderName());
                        ds.setJobDetails(d.getJobDetails());
                        ds.setJobOwner(d.getJobOwner());
                        ds.setCustomerName(d.getCustomerName());
                        ds.setAssignee(d.getAssignee());
                        ds.setAssigneeFirst(d.getAssigneeFirst());
                        ds.setDeadlineDate(d.getDeadlineDate());
                        ds.setDeadlineTime(d.getDeadlineTime());
                        ds.setProcessStatus(d.getProcessStatus());
                        ds.setConfirmStatus(d.getConfirmStatus());
                        ds.setConfirmDate(d.getConfirmDate());
                        ds.setFileName(d.getFileName());
                        ds.setNoteEdit(d.getNoteEdit());
                        ds.setRemarks(d.getRemarks());
                        ds.setRemarkAdd(d.getRemarkAdd());
                        ds.setVersion(d.getVersion());
                        ds.setJoId(d.getJoId());
                        ds.setQtId(d.getQtId());
                        ds.setQpId(d.getQpId());
                        ds.setStartDatetime(d.getStartDatetime());
                        ds.setEndDatetime(d.getEndDatetime());
                        if (d.getStartDatetime() != null && d.getEndDatetime() != null) {
                            ds.setDurationMinutes(ChronoUnit.MINUTES.between(d.getStartDatetime(), d.getEndDatetime()));
                        }
                        result.setDesignOrder(ds);
                    });
        }

        // Sample Order (from sample_order_id of primary)
        if (primaryOrder.getSampleOrderId() != null) {
            sampleOrderRepo.findById(primaryOrder.getSampleOrderId()).ifPresent(s -> {
                JoHistoryDTO.SampleOrderSummary ss = new JoHistoryDTO.SampleOrderSummary();
                ss.setId(s.getId());
                ss.setOrderDate(s.getOrderDate());
                ss.setOrderTime(s.getOrderTime());
                ss.setFolderName(s.getFolderName());
                ss.setJobOwner(s.getJobOwner());
                ss.setCustomerName(s.getCustomerName());
                ss.setResponsiblePerson(s.getResponsiblePerson());
                ss.setStatus(s.getStatus());
                ss.setDeliveryDate(s.getDeliveryDate());
                ss.setDeliveryTime(s.getDeliveryTime());
                ss.setQuantity(s.getQuantity());
                ss.setUnit(s.getUnit());
                ss.setNote(s.getNote());
                ss.setNoteEdit(s.getNoteEdit());
                ss.setCancelRemarks(s.getCancelRemarks());
                ss.setFileName(s.getFileName());
                ss.setJobType(s.getJobType());
                ss.setPrintType(s.getPrintType());
                ss.setPaperType(s.getPaperType());
                ss.setDiecuttingType(s.getDiecuttingType());
                ss.setCoatType(s.getCoatType());
                ss.setSystemPrint(s.getSystemPrint());
                ss.setColorPrint(s.getColorPrint());
                ss.setPaperGram(s.getPaperGram());
                ss.setJobId(s.getJobId());
                ss.setQtId(s.getQtId());
                ss.setQpId(s.getQpId());
                ss.setPrint2Page(s.getPrint2Page());
                ss.setTotalPrintSheets(s.getTotalPrintSheets());
                ss.setCreatedAt(s.getCreatedAt());
                ss.setUpdatedAt(s.getUpdatedAt());
                if (s.getOrderDate() != null && s.getDeliveryDate() != null) {
                    ss.setDurationDays(ChronoUnit.DAYS.between(s.getOrderDate(), s.getDeliveryDate()));
                }
                result.setSampleOrder(ss);
            });
        }

        // Production Rounds
        List<JoHistoryDTO.ProductionRound> rounds = new ArrayList<>();
        int roundNum = allOrders.size();
        for (ProductionOrder o : allOrders) {
            JoHistoryDTO.ProductionRound round = new JoHistoryDTO.ProductionRound();
            round.setProductionOrderId(o.getId());
            round.setRoundNumber(roundNum--);
            round.setIsNewProof(o.getIsNewProof());
            round.setJobStatus(o.getJobStatus());
            round.setProcessStatus(o.getProcessStatus());
            round.setCancelRemarks(o.getCancelRemarks());
            round.setRemarks(o.getRemarks());
            round.setDecisionAuthority(o.getDecisionAuthority());
            round.setDecisionAuthorityRemarks(o.getDecisionAuthorityRemarks());
            round.setMoldStatus(o.getMoldStatus());
            round.setMoldMakerName(o.getMoldMakerName());
            round.setPrintingMachine(o.getPrintingMachine());
            round.setOperatorName(o.getOperatorName());
            round.setInspector(o.getInspector());
            round.setPostpone(o.getPostpone());
            round.setPrint2Page(o.getPrint2Page());
            round.setPrintRound(o.getPrintRound());
            round.setPrintRoundPage2(o.getPrintRoundPage2());
            round.setDeadlineDate(o.getDeadlineDate());
            round.setDeliveryDate(o.getDeliveryDate());
            round.setInspectionDate(o.getInspectionDate());
            round.setCreatedAt(o.getCreatedAt());
            round.setUpdatedAt(o.getUpdatedAt());
            round.setCustomerFeedback(o.getCustomerFeedback());

            // Print Job for this round
            if (o.getPrintJobId() != null) {
                printJobRepo.findById(o.getPrintJobId()).ifPresent(pj -> {
                    JoHistoryDTO.PrintJobSummary pjs = new JoHistoryDTO.PrintJobSummary();
                    pjs.setId(pj.getId());
                    pjs.setJobId(pj.getJobId());
                    pjs.setCustomerJobName(pj.getCustomerJobName());
                    pjs.setJobStatus(pj.getJobStatus());
                    pjs.setJobType(pj.getJobType());
                    pjs.setPrintType(pj.getPrintType());
                    pjs.setPaperType(pj.getPaperType());
                    pjs.setDiecuttingType(pj.getDiecuttingType());
                    pjs.setCoatType(pj.getCoatType());
                    pjs.setSystemPrint(pj.getSystemPrint());
                    pjs.setColorPrint(pj.getColorPrint());
                    pjs.setPaperGram(pj.getPaperGram());
                    pjs.setPrinterName(pj.getPrinterName());
                    pjs.setSampleRefNo(pj.getSampleRefNo());
                    pjs.setDecisionAuthority(pj.getDecisionAuthority());
                    pjs.setDecisionAuthorityRemarks(pj.getDecisionAuthorityRemarks());
                    pjs.setTypeJob(pj.getTypeJob());
                    pjs.setTotalPrintSheets(pj.getTotalPrintSheets());
                    pjs.setProductionQty(pj.getProductionQty());
                    pjs.setSetupWaste(pj.getSetupWaste());
                    pjs.setCurrentRound(pj.getCurrentRound());
                    pjs.setGoodQty(pj.getGoodQty());
                    pjs.setWasteQty(pj.getWasteQty());
                    pjs.setIsSample(pj.getIssample());
                    pjs.setPrint2Page(pj.getPrint2Page());
                    pjs.setDeliveryDate(pj.getDeliveryDate());
                    pjs.setDeliveryTime(pj.getDeliveryTime());
                    pjs.setCreatedAt(pj.getCreatedAt());

                    // Print Logs (OD)
                    List<PrintLog> logs = printLogRepo.findByJobIdOrderByStartedAtDesc(pj.getId());
                    pjs.setPrintLogs(logs.stream().map(pl -> {
                        ReorderDTO.PrintLogSummary pls = new ReorderDTO.PrintLogSummary();
                        pls.setId(pl.getId());
                        pls.setStartedAt(pl.getStartedAt());
                        pls.setEndedAt(pl.getEndedAt());
                        pls.setOperatorName(pl.getOperatorName());
                        pls.setTotalSheetsUsed(pl.getTotalSheetsUsed());
                        pls.setGoodQty(pl.getGoodQty());
                        pls.setWasteQty(pl.getWasteQty());
                        pls.setPaperReqStart(pl.getPaperReqStart());
                        pls.setPaperReqEnd(pl.getPaperReqEnd());
                        pls.setNote(pl.getNote());
                        if (pl.getLogType() != null)
                            pls.setLogType(pl.getLogType().name());
                        if (pl.getPrintSide() != null)
                            pls.setPrintSide(pl.getPrintSide().name());
                        if (pl.getStartedAt() != null && pl.getEndedAt() != null) {
                            pls.setDurationMinutes(ChronoUnit.MINUTES.between(pl.getStartedAt(), pl.getEndedAt()));
                        }
                        return pls;
                    }).collect(Collectors.toList()));

                    // Print Logs QA
                    List<PrintLogQa> qas = printLogQaRepo.findByJobIdOrderByCreatedAtDesc(pj.getId());
                    pjs.setPrintLogsQa(qas.stream().map(qa -> {
                        ReorderDTO.PrintLogQaSummary qasum = new ReorderDTO.PrintLogQaSummary();
                        qasum.setId(qa.getId());
                        qasum.setQcColorMatch(qa.getQcColorMatch());
                        qasum.setQcColorConsistency(qa.getQcColorConsistency());
                        qasum.setQcInkResidue(qa.getQcInkResidue());
                        qasum.setQcInkTransfer(qa.getQcInkTransfer());
                        qasum.setQcStains(qa.getQcStains());
                        qasum.setQcAlignment(qa.getQcAlignment());
                        qasum.setQcScratches(qa.getQcScratches());
                        qasum.setQcMixedJobs(qa.getQcMixedJobs());
                        qasum.setPrintedSheetNumber(qa.getPrintedSheetNumber());
                        qasum.setQcRemark(qa.getQcRemark());
                        qasum.setOperatorName(qa.getOperatorName());
                        qasum.setCreatedAt(qa.getCreatedAt());
                        return qasum;
                    }).collect(Collectors.toList()));

                    // Print Logs OS
                    List<PrintLogOs> osLogs = printLogOsRepo.findByJobId(pj.getId());
                    pjs.setPrintLogsOs(osLogs.stream().map(os -> {
                        ReorderDTO.PrintLogOsSummary ossum = new ReorderDTO.PrintLogOsSummary();
                        ossum.setId(os.getId());
                        ossum.setStartTime(os.getStartTime());
                        ossum.setEndTime(os.getEndTime());
                        ossum.setOperatorName(os.getOperatorName());
                        ossum.setMachineName(os.getMachineName());
                        ossum.setStatus(os.getStatus() != null ? os.getStatus().name() : null);
                        ossum.setPrintSide(os.getPrintSide());
                        ossum.setTempFountain(os.getTempFountain());
                        ossum.setIpaPercent(os.getIpaPercent());
                        ossum.setConductivity(os.getConductivity());
                        ossum.setAirPressure(os.getAirPressure());
                        ossum.setPaperBrightness(os.getPaperBrightness());
                        ossum.setFlagHasCmyk(os.getFlagHasCmyk());
                        ossum.setFlagSpecialColor(os.getFlagSpecialColor());
                        ossum.setFlagInkNew(os.getFlagInkNew());
                        ossum.setFlagInkOld(os.getFlagInkOld());
                        ossum.setCLot(os.getCLot());
                        ossum.setCBrand(os.getCBrand());
                        ossum.setMLot(os.getMLot());
                        ossum.setMBrand(os.getMBrand());
                        ossum.setYLot(os.getYLot());
                        ossum.setYBrand(os.getYBrand());
                        ossum.setKLot(os.getKLot());
                        ossum.setKBrand(os.getKBrand());
                        ossum.setCheckPlateCondition(os.getCheckPlateCondition());
                        ossum.setCheckBlanketCondition(os.getCheckBlanketCondition());
                        ossum.setCheckMachineWashed(os.getCheckMachineWashed());
                        ossum.setRefProof(os.getRefProof());
                        ossum.setRefDigital(os.getRefDigital());
                        ossum.setRefOldJob(os.getRefOldJob());
                        ossum.setRefNotSerious(os.getRefNotSerious());
                        ossum.setQcRemark(os.getQcRemark());
                        ossum.setTotalProduct(os.getTotalProduct());
                        if (os.getStartTime() != null && os.getEndTime() != null) {
                            ossum.setDurationMinutes(ChronoUnit.MINUTES.between(os.getStartTime(), os.getEndTime()));
                        }
                        return ossum;
                    }).collect(Collectors.toList()));

                    round.setPrintJob(pjs);
                });
            }
            rounds.add(round);
        }
        result.setProductionRounds(rounds);

        // Coating (shared per JO)
        coatingJobRepo.findByJoId(jobId).stream().findFirst().ifPresent(cj -> {
            JoHistoryDTO.CoatingJobSummary cjs = new JoHistoryDTO.CoatingJobSummary();
            cjs.setId(cj.getId());
            cjs.setJoId(cj.getJoId());
            cjs.setJobCustomerName(cj.getJobCustomerName());
            cjs.setJobOwnerName(cj.getJobOwnerName());
            cjs.setStatus(cj.getStatus() != null ? cj.getStatus().name() : null);
            cjs.setTechnicianName(cj.getTechnicianName());
            cjs.setReceivedSheetsQty(cj.getReceivedSheetsQty());
            cjs.setRequiredSheetsQty(cj.getRequiredSheetsQty());
            cjs.setIsSample(cj.getIsSample());
            cjs.setOrderDatetime(cj.getOrderDatetime());
            cjs.setDeliveryDatetime(cj.getDeliveryDatetime());
            List<CoatingLog> clogs = coatingLogRepo.findByCoatingJobIdOrderByIdAsc(cj.getId());
            cjs.setCoatingLogs(clogs.stream().map(cl -> {
                ReorderDTO.CoatingLogSummary cs = new ReorderDTO.CoatingLogSummary();
                cs.setId(cl.getId());
                cs.setReportDate(cl.getReportDate());
                cs.setStartTime(cl.getStartTime());
                cs.setEndTime(cl.getEndTime());
                cs.setCoatingType(cl.getCoatingType());
                cs.setLaminatingTemp(cl.getLaminatingTemp());
                cs.setFilmStockName(cl.getFilmStockName());
                cs.setPaperLength(cl.getPaperLength());
                cs.setSheetQty(cl.getSheetQty());
                cs.setTechnicianName(cl.getTechnicianName());
                cs.setRemarks(cl.getRemarks());
                if (cl.getStartTime() != null && cl.getEndTime() != null) {
                    cs.setDurationMinutes(ChronoUnit.MINUTES.between(cl.getStartTime(), cl.getEndTime()));
                }
                return cs;
            }).collect(Collectors.toList()));
            result.setCoatingJob(cjs);
        });

        // Stamping (shared per JO)
        List<ProductionStamping> stampings = stampingRepo.findByJobOrderNo(jobId);
        result.setStampingLogs(stampings.stream().map(st -> {
            JoHistoryDTO.StampingSummary ss = new JoHistoryDTO.StampingSummary();
            ss.setId(st.getId());
            ss.setReportDate(st.getReportDate());
            ss.setStartTime(st.getStartTime());
            ss.setEndTime(st.getEndTime());
            ss.setTotalTime(st.getTotalTime());
            ss.setQuantity(st.getQuantity());
            ss.setStampingType(st.getStampingType());
            ss.setReporterName(st.getReporterName());
            ss.setRemarks(st.getRemarks());
            return ss;
        }).collect(Collectors.toList()));

        // QC (shared per JO)
        qcJobRepo.findByJoId(jobId).stream().findFirst().ifPresent(qj -> {
            JoHistoryDTO.QcJobSummary qjs = new JoHistoryDTO.QcJobSummary();
            qjs.setId(qj.getId());
            qjs.setJoId(qj.getJoId());
            qjs.setJobName(qj.getJobName());
            qjs.setResponsibleName(qj.getResponsibleName());
            qjs.setStatus(qj.getStatus());
            qjs.setQcType(qj.getQcType());
            qjs.setQcDetail(qj.getQcDetail());
            qjs.setPartName(qj.getPartName());
            qjs.setQcLocation(qj.getQcLocation());
            qjs.setStartQcDatetime(qj.getStartQcDatetime());
            qjs.setDeliveryDatetime(qj.getDeliveryDatetime());
            qjs.setReceivedQty(qj.getReceivedQty());
            qjs.setPassedQty(qj.getPassedQty());
            qjs.setBundlesPerPack(qj.getBundlesPerPack());
            qjs.setBoxesPerBundle(qj.getBoxesPerBundle());
            qjs.setPassedQtyFraction(qj.getPassedQtyFraction());
            qjs.setBundlesPerPackFraction(qj.getBundlesPerPackFraction());
            qjs.setPiecesFraction(qj.getPiecesFraction());

            List<LogQc> qcLogs = logQcRepo.findByQcJobIdOrderByIdAsc(qj.getId());
            qjs.setQcLogs(qcLogs.stream().map(lq -> {
                ReorderDTO.QcLogSummary qs = new ReorderDTO.QcLogSummary();
                qs.setId(lq.getId());
                qs.setReportDate(lq.getReportDate());
                qs.setStartTime(lq.getStartTime());
                qs.setEndTime(lq.getEndTime());
                qs.setReceivedQty(lq.getReceivedQty());
                qs.setPassedQty(lq.getPassedQty());
                qs.setFailedQty(lq.getFailedQty());
                qs.setBundlesPerPack(lq.getBundlesPerPack());
                qs.setBoxesPerBundle(lq.getBoxesPerBundle());
                qs.setPassedQtyFraction(lq.getPassedQtyFraction());
                qs.setBundlesPerPackFraction(lq.getBundlesPerPackFraction());
                qs.setPiecesFraction(lq.getPiecesFraction());
                qs.setQcType(lq.getQcType());
                qs.setOperatorName(lq.getOperatorName());
                qs.setRemarks(lq.getRemarks());
                if (lq.getStartTime() != null && lq.getEndTime() != null) {
                    qs.setDurationMinutes(ChronoUnit.MINUTES.between(lq.getStartTime(), lq.getEndTime()));
                }
                return qs;
            }).collect(Collectors.toList()));

            List<QcWasteReport> wastes = qcWasteReportRepo.findByQcJobId(qj.getId());
            qjs.setQcWasteReports(wastes.stream().map(w -> {
                ReorderDTO.QcWasteReportSummary ws = new ReorderDTO.QcWasteReportSummary();
                ws.setId(w.getId());
                ws.setQcJobId(w.getQcJobId());
                ws.setProcessName(w.getProcessName());
                ws.setTechnicianName(w.getTechnicianName());
                ws.setWasteQty(w.getWasteQty());
                ws.setRemarks(w.getRemarks());
                return ws;
            }).collect(Collectors.toList()));

            List<QcStaff> staffs = qcStaffRepo.findByQcJobId(qj.getId());
            qjs.setQcStaffs(staffs.stream().map(qs -> {
                ReorderDTO.QcStaffSummary s = new ReorderDTO.QcStaffSummary();
                s.setId(qs.getId());
                s.setQcJobId(qs.getQcJobId());
                s.setUserName(qs.getUserName());
                s.setPacks(qs.getPacks());
                s.setPacksFraction(qs.getPacksFraction());
                s.setBundlesFraction(qs.getBundlesFraction());
                s.setPiecesFraction(qs.getPiecesFraction());
                return s;
            }).collect(Collectors.toList()));

            result.setQcJob(qjs);
        });

        // Tracking (Delivery Routing by Part)
        List<ProductionJob> trackingList = productionJobRepo.findByJobIdOrderByIdAsc(jobId);
        if (trackingList != null && !trackingList.isEmpty()) {
            result.setTrackingJobs(trackingList.stream().map(pj -> {
                JoHistoryDTO.TrackingSummary ts = new JoHistoryDTO.TrackingSummary();
                ts.setId(pj.getId());
                ts.setJobId(pj.getJobId());
                ts.setPartName(pj.getPartName() != null && !pj.getPartName().isBlank() ? pj.getPartName() : "ชิ้นส่วนหลัก");
                ts.setProductionQuantity(pj.getProductionQuantity());
                ts.setPrintStatus(pj.getPrintStatus());
                ts.setDeliveryStatus(pj.getDeliveryStatus());
                ts.setDueDate(pj.getDueDate());

                ts.setPrintingResponsible(pj.getPrintingResponsible());
                ts.setPrintingDate(pj.getPrintingDate());
                ts.setPrintQuantity(pj.getPrintQuantity());

                ts.setCoatingResponsible(pj.getCoatingResponsible());
                ts.setCoatingLocation(pj.getCoatingLocation());
                ts.setCoatingDate(pj.getCoatingDate());
                ts.setCoatingQty(pj.getCoatingQty());

                ts.setStampingResponsible(pj.getStampingResponsible());
                ts.setStampingLocation(pj.getStampingLocation());
                ts.setStampingDate(pj.getStampingDate());
                ts.setStampingQty(pj.getStampingQty());

                ts.setGluingResponsible(pj.getGluingResponsible());
                ts.setGluingLocation(pj.getGluingLocation());
                ts.setGluingDate(pj.getGluingDate());
                ts.setGluingQty(pj.getGluingQty());

                ts.setQcLocation(pj.getQcLocation());
                ts.setQcType(pj.getQcType());
                ts.setQcDate(pj.getQcDate());

                return ts;
            }).collect(Collectors.toList()));
        }

        return result;
    }

    // ═══════════════════════════════════════════════════════════════
    // ReOrder — สร้าง Design Order ใหม่จาก JO เดิม
    // ═══════════════════════════════════════════════════════════════
    public DesignOrders reorderDesign(ReorderDesignRequest req) {
        DesignOrders d = new DesignOrders();
        d.setJoId(req.getJoId());
        d.setQtId(req.getQtId());
        d.setQpId(req.getQpId());
        d.setReorderFromJoId(req.getReorderFromJoId());
        d.setDeadlineDate(req.getDeadlineDate());
        d.setDeadlineTime(req.getDeadlineTime());
        d.setFolderName(req.getFolderName());
        d.setJobOwner(req.getJobOwner());
        d.setCustomerName(req.getCustomerName());
        d.setJobDetails(req.getJobDetails());
        d.setRemarks(req.getRemarks());
        d.setOrderDate(java.time.LocalDate.now());
        d.setOrderTime(java.time.LocalTime.now());
        d.setProcessStatus("รอผู้รับผิดชอบยืนยัน");
        d.setAssignee("รอผู้รับผิดชอบยืนยัน");
        d.setConfirmStatus("รอผู้รับผิดชอบยืนยัน");
        return designOrdersRepo.save(d);
    }

    // ═══════════════════════════════════════════════════════════════
    // ReOrder — สร้าง Sample Order ใหม่จาก JO เดิม
    // ═══════════════════════════════════════════════════════════════
    public SampleOrder reorderSample(ReorderSampleRequest req) {
        SampleOrder s = new SampleOrder();
        s.setJobId(req.getJobId());
        s.setQtId(req.getQtId());
        s.setQpId(req.getQpId());
        s.setReorderFromJoId(req.getReorderFromJoId());
        s.setDeliveryDate(req.getDeliveryDate());
        s.setDeliveryTime(req.getDeliveryTime());
        s.setQuantity(req.getQuantity());
        s.setUnit(req.getUnit());
        s.setNote(req.getNote());

        // Copy standard fields
        s.setFolderName(req.getFolderName());
        s.setCustomerName(req.getCustomerName());
        s.setJobOwner(req.getJobOwner());
        s.setResponsiblePerson("รอผู้รับผิดชอบอนุมัติ");
        // Default values
        s.setOrderDate(java.time.LocalDate.now());
        s.setOrderTime(java.time.LocalTime.now());
        s.setStatus("รอผู้รับผิดชอบอนุมัติ");
        s.setIsCreateSample(true);

        return sampleOrderRepo.save(s);
    }

    // ═══════════════════════════════════════════════════════════════
    // ReOrder — สร้าง Production Order ใหม่จาก JO เดิม
    // ═══════════════════════════════════════════════════════════════
    public ProductionOrder reorderProduction(ReorderProductionRequest req) {
        ProductionOrder p = new ProductionOrder();
        p.setJobId(req.getJobId());
        p.setQtId(req.getQtId());
        p.setQpId(req.getQpId());
        p.setReorderFromJoId(req.getReorderFromJoId());
        p.setDeadlineDate(req.getDeadlineDate());
        p.setDeadlineTime(req.getDeadlineTime());
        p.setRemarks(req.getRemarks());

        // Copy standard fields
        p.setFolderName(req.getFolderName());
        p.setCustomerName(req.getCustomerName());
        p.setJobOwner(req.getJobOwner());
        p.setDecisionAuthority(req.getDecisionAuthority());
        p.setDecisionAuthorityRemarks(req.getDecisionAuthorityRemarks());

        // Copy technical specs from request (if provided) or original
        List<ProductionOrder> originals = productionOrderRepo.findByJobIdOrderByIdDesc(req.getReorderFromJoId());
        ProductionOrder orig = originals.isEmpty() ? null : originals.get(0);

        p.setUsedFile(orig != null ? orig.getUsedFile() : null);
        p.setColorSample(orig != null ? orig.getColorSample() : null);
        p.setJobType(orig != null ? orig.getJobType() : null);
        p.setQcType(orig != null ? orig.getQcType() : null);
        p.setQcLocation(orig != null ? orig.getQcLocation() : null);
        p.setPrint2Page(orig != null ? orig.getPrint2Page() : null);

        // Technical Spec Fields
        p.setSampleJobType(req.getSampleJobType() != null ? req.getSampleJobType()
                : (orig != null ? orig.getSampleJobType() : null));
        p.setSamplePrintingSystem(req.getSamplePrintingSystem() != null ? req.getSamplePrintingSystem()
                : (orig != null ? orig.getSamplePrintingSystem() : null));
        p.setSamplePrintingStyle(req.getSamplePrintingStyle() != null ? req.getSamplePrintingStyle()
                : (orig != null ? orig.getSamplePrintingStyle() : null));
        p.setSamplePrintingColor(req.getSamplePrintingColor() != null ? req.getSamplePrintingColor()
                : (orig != null ? orig.getSamplePrintingColor() : null));
        p.setSamplePaperSize(req.getSamplePaperSize() != null ? req.getSamplePaperSize()
                : (orig != null ? orig.getSamplePaperSize() : null));
        p.setSamplePaperGrammage(req.getSamplePaperGrammage() != null ? req.getSamplePaperGrammage()
                : (orig != null ? orig.getSamplePaperGrammage() : null));
        p.setSampleCoatingStyle(req.getSampleCoatingStyle() != null ? req.getSampleCoatingStyle()
                : (orig != null ? orig.getSampleCoatingStyle() : null));
        p.setSampleDiecutStyle(req.getSampleDiecutStyle() != null ? req.getSampleDiecutStyle()
                : (orig != null ? orig.getSampleDiecutStyle() : null));
        p.setSampleSpecialInstructions(req.getSampleSpecialInstructions() != null ? req.getSampleSpecialInstructions()
                : (orig != null ? orig.getSampleSpecialInstructions() : null));
        p.setSampleDeliveryTimestamp(req.getSampleDeliveryTimestamp() != null ? req.getSampleDeliveryTimestamp()
                : (orig != null ? orig.getSampleDeliveryTimestamp() : null));

        p.setJobStatus("รอผู้รับผิดชอบยืนยัน");
        p.setProcessStatus("รอผู้รับผิดชอบยืนยัน");
        p.setMoldStatus("รอผู้รับผิดชอบยืนยัน");
        p.setOperatorName("รอผู้รับผิดชอบยืนยัน");
        p.setCreatedTime(java.time.LocalTime.now());

        return productionOrderRepo.save(p);
    }
}
