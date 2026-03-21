package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "production_order_parts")
@Data
@EqualsAndHashCode(callSuper = true)
public class ProductionOrderPart extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "production_order_id", nullable = false)
    private Integer productionOrderId;

    @Column(name = "part_name")
    private String partName;
}
