package com.boxcorner.boxcorner.entity;
import jakarta.persistence.*; 
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_jobs")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "job_date", nullable = false)
    private LocalDate date; 

    @Column(name = "job_code")
    private String jobId; 

    @Column(name = "customer_job_name", nullable = false)
    private String customerJobName; 


    @Column(name = "print_quantity")
    private Integer printQuantity;

    @Column(name = "production_quantity")
    private Integer productionQuantity;


    // งานพิมพ์
    @Column(name = "printing_date")
    private LocalDate printingDate;

    @Column(name = "printing_responsible", length = 100)
    private String printingResponsible;

    // งานเคลือบ
    @Column(name = "coating_date")
    private LocalDate coatingDate;

    @Column(name = "coating_responsible", length = 100)
    private String coatingResponsible;

    // งานปั๊ม
    @Column(name = "stamping_date")
    private LocalDate stampingDate;

    @Column(name = "stamping_responsible", length = 100)
    private String stampingResponsible;

    // งานปะ
    @Column(name = "gluing_date")
    private LocalDate gluingDate;

    @Column(name = "gluing_responsible", length = 100)
    private String gluingResponsible;

    // QC/QA
    @Column(name = "qc_date")
    private LocalDate qcDate;

    @Column(name = "qc_status", length = 50)
    private String qcStatus;

    // --- 4. ข้อมูลสำคัญและจัดส่ง ---

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "print_status", length = 50)
    private String printStatus;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    // --- Audit Fields (จัดการเวลาอัตโนมัติ) ---

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}