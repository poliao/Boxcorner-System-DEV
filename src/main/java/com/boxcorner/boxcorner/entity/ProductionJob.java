package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "production_jobs")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionJob extends BaseEntity {

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

    @Column(name = "coating_location", length = 200)
    private String coatingLocation;

    // งานปั๊ม
    @Column(name = "stamping_date")
    private LocalDate stampingDate;

    @Column(name = "stamping_responsible", length = 100)
    private String stampingResponsible;

    @Column(name = "stamping_location", length = 200)
    private String stampingLocation;

    // งานปะ
    @Column(name = "gluing_date")
    private LocalDate gluingDate;

    @Column(name = "gluing_responsible", length = 100)
    private String gluingResponsible;

    @Column(name = "gluing_location", length = 200)
    private String gluingLocation;

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

    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;

    @Column(name = "delivery_status")
    private String deliveryStatus;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "machine_setup_count")
    private String machineSetupCount;

    @Column(name = "printing_record_id")
    private String printingRecordId;

    @Column(name = "pap_order_id")
    private Integer papOrderId;

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