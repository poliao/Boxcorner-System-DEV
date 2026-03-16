package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "qc_jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class QcJob extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobStatus status;

    @Column(name = "jo_id", length = 50, nullable = false)
    private String joId;

    @Column(name = "job_name", length = 255)
    private String jobName;

    @Column(name = "responsible_name", length = 100)
    private String responsibleName;

    @Column(name = "delivery_datetime")
    private LocalDate deliveryDatetime;

    @Column(name = "product_job_id", length = 50)
    private String productJobId;

    @Column(name = "pap_order_id")
    private Integer papOrderId;

    @Column(name = "received_qty")
    private Integer receivedQty;

    @Column(name = "passed_qty")
    private Integer passedQty;

    @Column(name = "bundles_per_pack")
    private Integer bundlesPerPack;

    @Column(name = "boxes_per_bundle")
    private Integer boxesPerBundle;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
