package com.boxcorner.boxcorner.entity;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;

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
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@Table(name = "production_orders")
public class ProductionOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "folder_name", nullable = false)
    private String folderName;

    @Column(name = "used_file")
    private String usedFile;

    @Column(name = "color_sample")
    private String colorSample;

    @Column(name = "job_owner")
    private String jobOwner;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @Column(name = "deadline_time")
    private LocalTime deadlineTime;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "job_status")
    private String jobStatus;

    @Column(name = "process_status")
    private String processStatus;

    @Column(name = "operator_name")
    private String operatorName;

    @Column(name = "inspection_date")
    private LocalDate inspectionDate;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "mold_status")
    private String moldStatus;

    @Column(name = "job_type")
    private String jobType;


    @Column(name = "sample_order_id")
    private Integer sampleOrderId;

    @Column(name = "mold_maker_name")
    private String moldMakerName;

    @Column(name = "printing_machine")
    private String printingMachine;

    @Column(name = "inspector")
    private String inspector;

    @Column(name = "postpone")
    private String postpone;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "data_dalivery")
    private Boolean dataDalivery;

    @Column(name = "cancel_remarks")
    private String cancelRemarks;

    @Column(name = "job_id")
    private String jobId;

    @Column(name = "qt_id")
    private String qtId;

    @Column(name = "qp_id")
    private String qpId;

    @Column(name = "decision_authority")
    private String decisionAuthority;

    @Column(name = "decision_authority_remarks")
    private String decisionAuthorityRemarks;

    @Column(name = "print2_page")
    private Boolean print2Page;

    @Column(name = "qc_type", length = 100)
    private String qcType;

    @Column(name = "qc_location")
    private String qcLocation;

    @Column(name = "created_time", updatable = false)
    private LocalTime createdTime;

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

    @Column(name = "sample_special_instructions")
    private String sampleSpecialInstructions;

    @Column(name = "sample_delivery_timestamp")
    private LocalDateTime sampleDeliveryTimestamp;

    @Column(name = "print_round")
    private Integer printRound;

    @Column(name = "print_round_page2")
    private Integer printRoundPage2;

    @Column(name = "print_job_id")
    private Long printJobId;

    @Column(name = "is_new_proof")
    private Boolean isNewProof = false;

    @Column(name = "reorder_from_jo_id")
    private String reorderFromJoId;

    @Column(name = "customer_feedback", columnDefinition = "TEXT")
    private String customerFeedback;
}