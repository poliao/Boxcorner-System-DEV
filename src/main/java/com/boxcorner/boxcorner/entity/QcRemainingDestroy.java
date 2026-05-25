package com.boxcorner.boxcorner.entity;

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
@Table(name = "qc_remaining_destroy")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class QcRemainingDestroy extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "qc_job_id")
    private Integer qcJobId;

    @Column(name = "total_pieces")
    private Integer totalPieces;

    @Column(name = "destroy_qty")
    private Integer destroyQty;

    @Column(name = "bundles_per_pack")
    private Integer bundlesPerPack;

    @Column(name = "boxes_per_bundle")
    private Integer boxesPerBundle;

    @Column(name = "destroy_qty_fraction")
    private Integer destroyQtyFraction;

    @Column(name = "bundles_per_pack_fraction")
    private Integer bundlesPerPackFraction;

    @Column(name = "pieces_fraction")
    private Integer piecesFraction;

    @Column(name = "qc_type", length = 50)
    private String qcType;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

}
