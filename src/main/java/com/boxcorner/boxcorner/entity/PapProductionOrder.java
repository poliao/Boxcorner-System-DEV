package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "pap_production_orders")
@Data
@EqualsAndHashCode(callSuper = true)
public class PapProductionOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Header
    @Column(name = "job_code", length = 50, unique = true)
    private String jobCode;
    @Column(name = "quotation", length = 100)
    private String quotation;
    @Column(name = "sale", length = 100)
    private String sale;
    @Column(name = "job_name", length = 255)
    private String jobName;
    @Column(name = "customer_name", length = 255)
    private String customerName;
    @Column(name = "customer_id", length = 50)
    private String customerId;
    @Column(name = "finished_size", length = 50)
    private String finishedSize;
    @Column(name = "received_date")
    private LocalDate receivedDate;
    @Column(name = "total_print_qty")
    private Integer totalPrintQty;
    @Column(name = "delivery_date")
    private LocalDate deliveryDate;
    @Column(name = "ordered_by", length = 100)
    private String orderedBy;
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // Platemaking
    @Column(name = "plate_date")
    private LocalDate plateDate;
    @Column(name = "plate_job_order_id", length = 50)
    private String plateJobOrderId;
    @Column(name = "plate_colors", length = 50)
    private String plateColors;
    @Column(name = "plate_screen_dot", length = 50)
    private String plateScreenDot;
    @Column(name = "plate_size", length = 50)
    private String plateSize;
    @Column(name = "plate_round")
    private Integer plateRound;
    @Column(name = "plate_note", length = 500)
    private String plateNote;
    @Column(name = "plate_responsible", length = 100)
    private String plateResponsible;

    // Cutting
    @Column(name = "cut_date")
    private LocalDate cutDate;
    @Column(name = "cut_pattern", length = 100)
    private String cutPattern;
    @Column(name = "cut_responsible", length = 100)
    private String cutResponsible;
    @Column(name = "cut_paper_type", length = 255)
    private String cutPaperType;
    @Column(name = "cut_paper_cut")
    private Integer cutPaperCut;
    @Column(name = "cut_paper_print_size", length = 50)
    private String cutPaperPrintSize;
    @Column(name = "cut_paper_print_qty")
    private Integer cutPaperPrintQty;
    @Column(name = "cut_paper_machine_setup")
    private Integer cutPaperMachineSetup;
    @Column(name = "cut_note", length = 500)
    private String cutNote;

    // Printing
    @Column(name = "print_machine", length = 100)
    private String printMachine;
    @Column(name = "print_job_type", length = 255)
    private String printJobType;
    @Column(name = "print_pattern", length = 100)
    private String printPattern;
    @Column(name = "print_lay")
    private Integer printLay;
    @Column(name = "print_scheduled_date")
    private LocalDate printScheduledDate;
    @Column(name = "print_confirmed_by", length = 100)
    private String printConfirmedBy;
    @Column(name = "print_note", length = 500)
    private String printNote;

    // Coating
    @Column(name = "coat_location", length = 100)
    private String coatLocation;
    @Column(name = "coat_pattern", length = 255)
    private String coatPattern;
    @Column(name = "coat_scheduled_date")
    private LocalDate coatScheduledDate;
    @Column(name = "coat_note", length = 500)
    private String coatNote;

    // Die Cutting
    @Column(name = "die_location", length = 100)
    private String dieLocation;

    // Foil Stamping
    @Column(name = "die_foil_type", length = 255)
    private String dieFoilType;
    @Column(name = "die_foil_block", length = 100)
    private String dieFoilBlock;
    @Column(name = "die_foil_new", length = 50)
    private String dieFoilNew;
    @Column(name = "die_foil_deadline")
    private LocalDate dieFoilDeadline;

    // Embossing
    @Column(name = "die_emboss_type", length = 255)
    private String dieEmbossType;
    @Column(name = "die_emboss_block", length = 100)
    private String dieEmbossBlock;
    @Column(name = "die_emboss_new", length = 50)
    private String dieEmbossNew;
    @Column(name = "die_emboss_deadline")
    private LocalDate dieEmbossDeadline;

    // Die Cut
    @Column(name = "die_cut_type", length = 255)
    private String dieCutType;
    @Column(name = "die_cut_block", length = 100)
    private String dieCutBlock;
    @Column(name = "die_cut_new", length = 50)
    private String dieCutNew;
    @Column(name = "die_cut_deadline")
    private LocalDate dieCutDeadline;

    // Gluing
    @Column(name = "glue_location", length = 100)
    private String glueLocation;
    @Column(name = "glue_pattern", length = 255)
    private String gluePattern;
    @Column(name = "glue_scheduled_date")
    private LocalDate glueScheduledDate;

    // QC & Delivery
    @Column(name = "qc_required_qty", length = 255)
    private String qcRequiredQty;
    @Column(name = "qc_qa", length = 100)
    private String qcQa;
    @Column(name = "qc_detail", length = 255)
    private String qcDetail;
    @Column(name = "qc_booklet_st")
    private Integer qcBookletSt;
    @Column(name = "qc_scheduled_date")
    private LocalDate qcScheduledDate;
    @Column(name = "delivery_location", length = 255)
    private String deliveryLocation;
    @Column(name = "delivery_pattern", length = 255)
    private String deliveryPattern;
    @Column(name = "delivery_datetime")
    private LocalDate deliveryDateTime;
}
