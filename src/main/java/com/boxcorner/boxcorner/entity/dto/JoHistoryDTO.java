package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class JoHistoryDTO {

    // === JO Level ===
    private String jobId;
    private String folderName;
    private String customerName;
    private String jobOwner;
    private String qtId;
    private String qpId;

    // === Summary Counts ===
    private int totalRounds;
    private int proofFailedCount;
    private int cancelledCount;

    // === Step 1: Design ===
    private DesignOrderSummary designOrder;

    // === Step 2: Sample ===
    private SampleOrderSummary sampleOrder;

    // === Production Rounds (1 per production_order) ===
    private List<ProductionRound> productionRounds;

    // === Shared per JO: Coating ===
    private CoatingJobSummary coatingJob;

    // === Shared per JO: Stamping ===
    private List<StampingSummary> stampingLogs;

    // === Shared per JO: QC ===
    private QcJobSummary qcJob;

    // ─────────────────── Inner Classes ───────────────────

    @Data
    public static class DesignOrderSummary {
        private Integer id;
        private LocalDate orderDate;
        private LocalTime orderTime;
        private String folderName;
        private String jobDetails;
        private String jobOwner;
        private String customerName;
        private String assignee;
        private String assigneeFirst;
        private LocalDate deadlineDate;
        private LocalTime deadlineTime;
        private String processStatus;
        private String confirmStatus;
        private LocalDate confirmDate;
        private String fileName;
        private String noteEdit;
        private String remarks;
        private String remarkAdd;
        private String version;
        private String joId;
        private String qtId;
        private String qpId;
        private LocalDateTime startDatetime;
        private LocalDateTime endDatetime;
        private Long durationMinutes;
    }

    @Data
    public static class SampleOrderSummary {
        private Integer id;
        private LocalDate orderDate;
        private LocalTime orderTime;
        private String folderName;
        private String jobOwner;
        private String customerName;
        private String responsiblePerson;
        private String status;
        private LocalDate deliveryDate;
        private LocalTime deliveryTime;
        private Integer quantity;
        private String unit;
        private String note;
        private String noteEdit;
        private String cancelRemarks;
        private String fileName;
        private String jobType;
        private String printType;
        private String paperType;
        private String diecuttingType;
        private String coatType;
        private String systemPrint;
        private String colorPrint;
        private String paperGram;
        private String jobId;
        private String qtId;
        private String qpId;
        private Boolean print2Page;
        private Integer totalPrintSheets;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long durationDays;
    }

    @Data
    public static class ProductionRound {
        private Integer productionOrderId;
        private Integer roundNumber;           // 1, 2, 3… sequentially
        private Boolean isNewProof;
        private String jobStatus;
        private String processStatus;
        private String cancelRemarks;
        private String remarks;
        private String decisionAuthority;
        private String decisionAuthorityRemarks;
        private String moldStatus;
        private String moldMakerName;
        private String printingMachine;
        private String operatorName;
        private String inspector;
        private String postpone;
        private Boolean print2Page;
        private Integer printRound;
        private Integer printRoundPage2;
        private LocalDate deadlineDate;
        private LocalDate deliveryDate;
        private LocalDate inspectionDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        private PrintJobSummary printJob;   // null if no print job
    }

    @Data
    public static class PrintJobSummary {
        private Long id;
        private String jobId;
        private String customerJobName;
        private String jobStatus;
        private String jobType;
        private String printType;
        private String paperType;
        private String diecuttingType;
        private String coatType;
        private String systemPrint;
        private String colorPrint;
        private String paperGram;
        private String printerName;
        private String sampleRefNo;
        private String decisionAuthority;
        private String decisionAuthorityRemarks;
        private String typeJob;
        private Integer totalPrintSheets;
        private Integer productionQty;
        private Integer setupWaste;
        private Integer currentRound;
        private Integer goodQty;
        private Integer wasteQty;
        private Boolean isSample;
        private Boolean print2Page;
        private LocalDate deliveryDate;
        private LocalTime deliveryTime;
        private LocalDateTime createdAt;

        private List<ReorderDTO.PrintLogSummary> printLogs;
        private List<ReorderDTO.PrintLogOsSummary> printLogsOs;
        private List<ReorderDTO.PrintLogQaSummary> printLogsQa;
    }

    @Data
    public static class CoatingJobSummary {
        private Integer id;
        private String joId;
        private String jobCustomerName;
        private String jobOwnerName;
        private String status;
        private String technicianName;
        private Integer receivedSheetsQty;
        private Integer requiredSheetsQty;
        private Boolean isSample;
        private LocalDateTime orderDatetime;
        private LocalDateTime deliveryDatetime;
        private List<ReorderDTO.CoatingLogSummary> coatingLogs;
    }

    @Data
    public static class StampingSummary {
        private Integer id;
        private LocalDate reportDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String totalTime;
        private Integer quantity;
        private String stampingType;
        private String reporterName;
        private String remarks;
    }

    @Data
    public static class QcJobSummary {
        private Integer id;
        private String joId;
        private String jobName;
        private String responsibleName;
        private String status;
        private String qcType;
        private String qcDetail;
        private String partName;
        private String qcLocation;
        private LocalDate startQcDatetime;
        private LocalDate deliveryDatetime;
        private Integer receivedQty;
        private Integer passedQty;
        private Integer bundlesPerPack;
        private Integer boxesPerBundle;
        private Integer passedQtyFraction;
        private Integer bundlesPerPackFraction;
        private Integer piecesFraction;
        private List<ReorderDTO.QcLogSummary> qcLogs;
        private List<ReorderDTO.QcStaffSummary> qcStaffs;
        private List<ReorderDTO.QcWasteReportSummary> qcWasteReports;
    }
}
