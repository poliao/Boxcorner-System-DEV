package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "print_jobs")
@Data
public class PrintJob extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDate createdAt;

    @Column(name = "job_id", length = 50)
    private String jobId;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "customer_job_name", columnDefinition = "TEXT")
    private String customerJobName;

    @Column(name = "job_status", length = 50)
    private String jobStatus = "Pending";

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
}