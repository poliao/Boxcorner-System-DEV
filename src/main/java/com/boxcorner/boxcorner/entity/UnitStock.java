package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
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

}
