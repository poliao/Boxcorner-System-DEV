package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "materials")
@EqualsAndHashCode(callSuper = true)
public class Material extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Integer materialId;

    @Column(name = "material_name", nullable = false)
    private String materialName;

    @Column(name = "material_size")
    private String materialSize;

    @Column(name = "category")
    private String category;

    @Column(name = "unit_large_name")
    private String unitLargeName;

    @Column(name = "unit_small_name")
    private String unitSmallName;

    @Column(name = "qty_per_box", nullable = false)
    private Integer qtyPerBox = 1;

    @Column(name = "current_stock_large")
    private Integer currentStockLarge = 0;

    @Column(name = "current_stock_small")
    private Integer currentStockSmall = 0;

    @Column(name = "total_stock_pices")
    private Integer totalStockPices = 0;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
