package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class StockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "unit_stock_id")
    private Long unitStockId;

    @Column(name = "material_id")
    private Integer materialId;

    @Column(name = "lot_id")
    private Integer lotId;

    public enum TransactionType {
        IN, OUT, RETURN, ADJUST
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;

    @Column(name = "quantity_major", precision = 10, scale = 2)
    private BigDecimal quantityMajor;

    @Column(name = "quantity_minor", precision = 10, scale = 2)
    private BigDecimal quantityMinor;

    @Column(name = "total_sheets")
    private Integer totalSheets;

    @Column(name = "reference_job_id")
    private Long referenceJobId;

    @Column(name = "operator_name", length = 100)
    private String operatorName;

    @CreatedDate
    @Column(name = "transaction_date", updatable = false)
    private LocalDateTime transactionDate;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
}
