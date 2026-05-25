package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "print_jobs")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class PrintJob extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "job_id", length = 255)
    private String jobId;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "customer_job_name", columnDefinition = "TEXT")
    private String customerJobName;

    @Column(name = "job_status", length = 100)
    private String jobStatus;

    @Column(name = "total_print_sheets")
    private Integer totalPrintSheets = 0;

    @Column(name = "production_qty")
    private Integer productionQty = 0;

    @Column(name = "printer_name", length = 100)
    private String printerName;

    @Column(name = "setup_waste")
    private Integer setupWaste = 0;

    @Column(name = "sample_ref_no", length = 100)
    private String sampleRefNo;

    @Column(name = "delivery_time")
    private LocalTime deliveryTime;

    @Column(name = "issample", nullable = false)
    private Boolean issample = false;

    @Column(name = "job_type")
    private String jobType;

    @Column(name = "print_type")
    private String printType;

    @Column(name = "paper_type")
    private String paperType;

    @Column(name = "diecutting_type")
    private String diecuttingType;

    @Column(name = "coat_type")
    private String coatType;

    @Column(name = "system_print")
    private String systemPrint;

    @Column(name = "color_print")
    private String colorPrint;

    @Column(name = "paper_gram")
    private String paperGram;

    @Column(name = "printing_record_id")
    private String printingRecordId;

    @Column(name = "sample_id")
    private String sampleId;

    @Column(name = "production_job_id")
    private String productionJobId;

    @Column(name = "print2_page")
    private Boolean print2Page;

    @Column(name = "type_job")
    private String typeJob;

    @Column(name = "production_order_id")
    private String productionOrderId;

    @Column(name = "decision_authority")
    private String decisionAuthority;

    @Column(name = "decision_authority_remarks")
    private String decisionAuthorityRemarks;

    @Column(name = "pap_order_id")
    private Integer papOrderId;

    @Column(name = "sample_job_type")
    private String sampleJobType;

    @Column(name = "sample_printing_system")
    private String samplePrintingSystem;

    @Column(name = "sample_printing_style")
    private String samplePrintingStyle;

    @Column(name = "sample_printing_color")
    private String samplePrintingColor;

    @Column(name = "sample_paper_size")
    private String samplePaperSize;

    @Column(name = "sample_paper_grammage")
    private String samplePaperGrammage;

    @Column(name = "sample_coating_style")
    private String sampleCoatingStyle;

    @Column(name = "sample_diecut_style")
    private String sampleDiecutStyle;

    @Column(name = "sample_special_instructions", columnDefinition = "TEXT")
    private String sampleSpecialInstructions;

    @Column(name = "sample_delivery_timestamp")
    private java.time.LocalDateTime sampleDeliveryTimestamp;

    @Column(name = "print_round")
    private Integer printRound;

    @Column(name = "print_round_page2")
    private Integer printRoundPage2;

    @Column(name = "current_round")
    private Integer currentRound = 0;

    @Column(name = "good_qty")
    private Integer goodQty = 0;

    @Column(name = "waste_qty")
    private Integer wasteQty = 0;

    @Column(name = "unit_stock_id")
    private Long unitStockId;

    @Column(name = "reorder_from_jo_id")
    private String reorderFromJoId;

    @jakarta.persistence.Transient
    private Boolean hasRealJob = false;
}