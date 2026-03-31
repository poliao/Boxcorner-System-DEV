package com.boxcorner.boxcorner.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "print_logs")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrintLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = true)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private PrintJob job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printer_id", nullable = true)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Printer printer;

    @Enumerated(EnumType.STRING)
    @Column(name = "print_side", nullable = true)
    private PrintSide printSide;

    @Enumerated(EnumType.STRING)
    @Column(name = "log_type")
    @Builder.Default
    private LogType logType = LogType.NORMAL;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "meter_color_start")
    private Long meterColorStart;

    @Column(name = "meter_color_end")
    private Long meterColorEnd;

    @Column(name = "meter_bw_start")
    private Long meterBwStart;

    @Column(name = "meter_bw_end")
    private Long meterBwEnd;

    // Ricoh Only (Nullable)
    @Column(name = "meter_special_start")
    private Long meterSpecialStart;

    @Column(name = "meter_special_end")
    private Long meterSpecialEnd;

    // --- Paper Requisition ---
    @Column(name = "operator_name")
    private String operatorName;

    @Column(name = "paper_req_start", length = 50)
    private String paperReqStart;

    @Column(name = "paper_req_end", length = 50)
    private String paperReqEnd;

    @Column(name = "total_sheets_used")
    private Integer totalSheetsUsed;

    @Column(name = "unit_stock_id")
    private Long unitStockId;

    @Column(name = "lot_id")
    private Integer lotId;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "good_qty")
    private Integer goodQty;

    @Column(name = "waste_qty")
    private Integer wasteQty;

    public long getColorUsage() {
        if (meterColorEnd == null || meterColorStart == null)
            return 0;
        return meterColorEnd - meterColorStart;
    }

    public long getBwUsage() {
        if (meterBwEnd == null || meterBwStart == null)
            return 0;
        return meterBwEnd - meterBwStart;
    }

    public long getSpecialUsage() {
        if (meterSpecialEnd == null || meterSpecialStart == null)
            return 0;
        return meterSpecialEnd - meterSpecialStart;
    }

    public long getTotalImpressions() {
        return getColorUsage() + getBwUsage() + getSpecialUsage();
    }
}