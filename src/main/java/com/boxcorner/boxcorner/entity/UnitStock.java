package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "unit_stock")
public class UnitStock extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", length = 255)
    private String itemName;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "paper_size", length = 50)
    private String paperSize;

    @Column(name = "major_quantity", precision = 12, scale = 2)
    private BigDecimal majorQuantity = BigDecimal.ZERO;

    @Column(name = "major_unit", length = 50)
    private String majorUnit;

    @Column(name = "minor_quantity", precision = 12, scale = 2)
    private BigDecimal minorQuantity = BigDecimal.ZERO;

    @Column(name = "minor_unit", length = 50)
    private String minorUnit;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
