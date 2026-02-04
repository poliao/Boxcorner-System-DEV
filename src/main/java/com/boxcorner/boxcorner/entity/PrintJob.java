package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "print_jobs")
@Data
public class PrintJob extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "job_id", nullable = false, length = 50)
    private String jobId;

    @Column(name = "delivery_date", nullable = false)
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
}