package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;
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
@Table(name = "log_qc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class LogQc extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "qc_job_id")
    private Integer qcJobId;

    @Column(name = "operator_name", length = 100)
    private String operatorName;

    @Column(name = "report_date")
    private LocalDate reportDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "received_qty")
    private Integer receivedQty;

    @Column(name = "passed_qty")
    private Integer passedQty;

    @Column(name = "failed_qty")
    private Integer failedQty;

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

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
