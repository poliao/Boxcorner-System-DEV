package com.boxcorner.boxcorner.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class ReorderDTO {

    // === Production Order (ทุก field) ===
    private Integer productionOrderId;
    private String jobId;
    private String qtId;
    private String qpId;
    private String folderName;
    private String customerName;
    private String jobOwner;
    private String jobType;
    private String jobStatus;
    private String processStatus;
    private String operatorName;
    private String inspector;
    private String moldStatus;
    private String moldMakerName;
    private String printingMachine;
    private String postpone;
    private String usedFile;
    private String colorSample;
    private String decisionAuthority;
    private String decisionAuthorityRemarks;
    private String cancelRemarks;
    private String remarks;
    private LocalDate deadlineDate;
    private LocalTime deadlineTime;
    private LocalDate deliveryDate;
    private LocalDate inspectionDate;
    private LocalTime createdTime;
    private LocalDateTime productionOrderCreatedAt;
    private LocalDateTime productionOrderUpdatedAt;
    private Boolean dataDalivery;
    private String customerFeedback;
    private Boolean print2Page;
    private Boolean isNewProof;
    private Integer printRound;
    private Integer printRoundPage2;
    private String qcType;
    private String qcLocation;
    // spec ตัวอย่างที่เก็บใน production_orders
    private String prodSampleJobType;
    private String prodSamplePrintingSystem;
    private String prodSamplePrintingStyle;
    private String prodSamplePrintingColor;
    private String prodSamplePaperSize;
    private String prodSamplePaperGrammage;
    private String prodSampleCoatingStyle;
    private String prodSampleDiecutStyle;
    private String prodSampleSpecialInstructions;
    private LocalDateTime prodSampleDeliveryTimestamp;

    // === ขั้นตอนที่ 1: ออกแบบ (Design Orders - ทุก field) ===
    private Integer designOrderId;
    private LocalDate designOrderDate;
    private LocalTime designOrderTime;
    private String designFolderName;
    private String designJobDetails;
    private String designJobOwner;
    private String designCustomerName;
    private String designAssignee;
    private String designAssigneeFirst;
    private LocalDate designDeadlineDate;
    private LocalTime designDeadlineTime;
    private String designProcessStatus;
    private String designConfirmStatus;
    private LocalDate designConfirmDate;
    private String designFileName;
    private String designNoteEdit;
    private String designRemarks;
    private String designRemarkAdd;
    private String designVersion;
    private String designJoId;
    private String designQtId;
    private String designQpId;
    private LocalDateTime designStartDatetime;
    private LocalDateTime designEndDatetime;
    private Long designDurationMinutes;

    // === ขั้นตอนที่ 2: ขึ้นตัวอย่าง (Sample Order - ทุก field) ===
    private Integer sampleOrderId;
    private LocalDate sampleOrderDate;
    private LocalTime sampleOrderTime;
    private String sampleFolderName;
    private String sampleJobOwner;
    private String sampleCustomerName;
    private String sampleResponsiblePerson;
    private String sampleStatus;
    private LocalDate sampleDeliveryDate;
    private LocalTime sampleDeliveryTime;
    private LocalDate sampleUpdateDateDelivery;
    private LocalTime sampleUpdateTimeDelivery;
    private Integer sampleQuantity;
    private String sampleUnit;
    private Boolean sampleIsCreateSample;
    private String sampleNote;
    private String sampleNoteEdit;
    private String sampleCancelRemarks;
    private String sampleFileName;
    private String sampleJobType;
    private String samplePrintType;
    private String samplePaperType;
    private String sampleDiecuttingType;
    private String sampleCoatType;
    private String sampleSystemPrint;
    private String sampleColorPrint;
    private String samplePaperGram;
    private String sampleJobId;
    private String sampleQtId;
    private String sampleQpId;
    private Boolean samplePrint2Page;
    private Integer sampleTotalPrintSheets;
    private LocalDateTime sampleCreatedAt;
    private LocalDateTime sampleUpdatedAt;
    private Long sampleDurationDays;

    // === ขั้นตอนที่ 3: สั่งผลิต (Print Job - ทุก field) ===
    private Long printJobId;
    private String printJobJobId;
    private String printJobCustomerJobName;
    private String printJobStatus;
    private String printJobType;
    private String printJobPrintType;
    private String printJobPaperType;
    private String printJobDiecuttingType;
    private String printJobCoatType;
    private String printJobSystemPrint;
    private String printJobColorPrint;
    private String printJobPaperGram;
    private String printJobPrinterName;
    private String printJobSampleRefNo;
    private String printJobDecisionAuthority;
    private String printJobDecisionAuthorityRemarks;
    private String printJobTypeJob;
    private Integer totalPrintSheets;
    private Integer productionQty;
    private Integer setupWaste;
    private Integer printRoundCurrent;
    private Integer printJobGoodQty;
    private Integer printJobWasteQty;
    private Boolean printJobIsSample;
    private Boolean printJobPrint2Page;
    private LocalDate printDeliveryDate;
    private LocalTime printDeliveryTime;
    private LocalDateTime printJobCreatedAt;
    private List<PrintLogSummary> printLogs;
    private List<PrintLogOsSummary> printLogOss;
    private List<PrintLogQaSummary> printLogQas;

    // === ขั้นตอนที่ 4: เคลือบ (Coating Job - ทุก field) ===
    private Integer coatingJobId;
    private String coatingJoId;
    private String coatingJobCustomerName;
    private String coatingJobOwnerName;
    private String coatingStatus;
    private String coatingTechnicianName;
    private Integer coatingReceivedSheetsQty;
    private Integer coatingRequiredSheetsQty;
    private Boolean coatingIsSample;
    private LocalDateTime coatingOrderDatetime;
    private LocalDateTime coatingDeliveryDatetime;
    private List<CoatingLogSummary> coatingLogs;

    // === ขั้นตอนที่ 5: ปั๊ม/ตัด (Stamping - ทุก field) ===
    private List<StampingSummary> stampingLogs;

    // === ขั้นตอนที่ 6: QC (QC Job - ทุก field) ===
    private Integer qcJobId;
    private String qcJobJoId;
    private String qcJobName;
    private String qcJobResponsibleName;
    private String qcStatus;
    private String qcJobType;
    private String qcJobDetail;
    private String qcJobPartName;
    private String qcJobLocation;
    private LocalDate qcStartDate;
    private LocalDate qcDeliveryDate;
    private Integer qcReceivedQty;
    private Integer qcPassedQty;
    private Integer qcBundlesPerPack;
    private Integer qcBoxesPerBundle;
    private Integer qcPassedQtyFraction;
    private Integer qcBundlesPerPackFraction;
    private Integer qcPiecesFraction;
    private List<QcLogSummary> qcLogs;
    private List<QcStaffSummary> qcStaffs;
    private List<QcWasteReportSummary> qcWasteReports;

    private List<ReorderDTO> siblingOrders;

    // === สรุประยะเวลารวม ===
    private Long totalDurationDays;

    // === สรุปจำนวนรอบผลิต (สำหรับ list view) ===
    private Integer totalOrders;
    private Integer proofFailedCount;
    private Integer cancelledCount;

    @Data
    public static class PrintLogSummary {
        private Long id;
        private LocalDateTime startedAt;
        private LocalDateTime endedAt;
        private Long durationMinutes;
        private String operatorName;
        private Integer totalSheetsUsed;
        private Integer goodQty;
        private Integer wasteQty;
        private String logType;
        private String printSide;
        private String paperReqStart;
        private String paperReqEnd;
        private String note;
    }

    @Data
    public static class CoatingLogSummary {
        private Integer id;
        private LocalDate reportDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Long durationMinutes;
        private String coatingType;
        private String laminatingTemp;
        private String filmStockName;
        private String paperLength;
        private Integer sheetQty;
        private String technicianName;
        private String remarks;
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
    public static class QcLogSummary {
        private Integer id;
        private LocalDate reportDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Long durationMinutes;
        private Integer receivedQty;
        private Integer passedQty;
        private Integer failedQty;
        private Integer bundlesPerPack;
        private Integer boxesPerBundle;
        private Integer passedQtyFraction;
        private Integer bundlesPerPackFraction;
        private Integer piecesFraction;
        private String qcType;
        private String operatorName;
        private String remarks;
    }
    @Data
    public static class PrintLogQaSummary {
        private Long id;
        private Boolean qcColorMatch;
        private Boolean qcColorConsistency;
        private Boolean qcInkResidue;
        private Boolean qcInkTransfer;
        private Boolean qcStains;
        private Boolean qcAlignment;
        private Boolean qcScratches;
        private Boolean qcMixedJobs;
        private Integer printedSheetNumber;
        private String qcRemark;
        private String operatorName;
        private LocalDateTime createdAt;
    }

    @Data
    public static class QcWasteReportSummary {
        private Long id;
        private Integer qcJobId;
        private String processName;
        private String technicianName;
        private Integer wasteQty;
        private String remarks;
    }

    @Data
    public static class PrintLogOsSummary {
        private Long id;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Long durationMinutes;
        private String operatorName;
        private String machineName;
        private String status;
        private String printSide;
        
        // Process parameters
        private Double tempFountain;
        private Double ipaPercent;
        private Integer conductivity;
        private Double airPressure;
        private String paperBrightness;
        
        // Ink flags
        private Boolean flagHasCmyk;
        private Boolean flagSpecialColor;
        private Boolean flagInkNew;
        private Boolean flagInkOld;
        
        // Ink details
        @JsonProperty("cLot")   private String cLot;
        @JsonProperty("cBrand") private String cBrand;
        @JsonProperty("mLot")   private String mLot;
        @JsonProperty("mBrand") private String mBrand;
        @JsonProperty("yLot")   private String yLot;
        @JsonProperty("yBrand") private String yBrand;
        @JsonProperty("kLot")   private String kLot;
        @JsonProperty("kBrand") private String kBrand;
        
        // Equipment & References
        private Boolean checkPlateCondition;
        private Boolean checkBlanketCondition;
        private Boolean checkMachineWashed;
        private Boolean refProof;
        private Boolean refDigital;
        private Boolean refOldJob;
        private Boolean refNotSerious;

        // Quality checks
        private Boolean qcAlignment;
        private Boolean qcScumming;
        private Boolean qcColorMatch;
        private Boolean qcColorDensity;
        private String qcRemark;
        private String totalProduct;
    }

    @Data
    public static class QcStaffSummary {
        private Integer id;
        private Integer qcJobId;
        private String userName;
        private Integer packs;
        private Integer packsFraction;
        private Integer bundlesFraction;
        private Integer piecesFraction;
    }
}
