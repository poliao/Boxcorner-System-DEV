package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @Column(name = "status")
    private String status;

    @Column(name = "jo_id", length = 50, nullable = false)
    private String joId;

    @Column(name = "job_name", length = 255)
    private String jobName;

    @Column(name = "responsible_name", length = 100)
    private String responsibleName;

    @Column(name = "delivery_datetime")
    private LocalDate deliveryDatetime;

    @Column(name = "start_qc_datetime")
    private LocalDate startQcDatetime;

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

    @Column(name = "passed_qty_fraction")
    private Integer passedQtyFraction;

    @Column(name = "bundles_per_pack_fraction")
    private Integer bundlesPerPackFraction;

    @Column(name = "pieces_fraction")
    private Integer piecesFraction;

    @Column(name = "qc_type", length = 50)
    private String qcType;

    @Column(name = "qc_detail", length = 50)
    private String qcDetail;

    @Column(name = "part_name")
    private String partName;

    @Column(name = "qc_location")
    private String qcLocation;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
