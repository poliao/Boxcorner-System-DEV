package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "paper_inventory")
public class PaperInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "unit_stock_id")
    private Long unitStockId;

    @Column(name = "current_major_qty", precision = 12, scale = 2)
    private BigDecimal currentMajorQty = BigDecimal.ZERO;

    @Column(name = "current_minor_qty", precision = 12, scale = 2)
    private BigDecimal currentMinorQty = BigDecimal.ZERO;

    @Column(name = "warehouse_location", length = 100)
    private String warehouseLocation;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "row_version")
    private Integer rowVersion = 0;

    // Transient fields for display (joined from unit_stock)
    @Transient
    private String itemName;
    @Transient
    private String category;
    @Transient
    private String paperSize;
    @Transient
    private String majorUnit;
    @Transient
    private String minorUnit;
}
