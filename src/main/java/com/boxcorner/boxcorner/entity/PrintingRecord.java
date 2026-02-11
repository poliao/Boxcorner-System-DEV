package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "printing_records")
@Data
public class PrintingRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "reference_id", length = 50)
    private String referenceId;

    @Column(name = "delivery_table_id")
    private Integer deliveryTableId;

    @Column(name = "job_id", nullable = false, length = 50)
    private String jobId;

    @Column(name = "meter_4color_start")
    private Integer meter4colorStart = 0;

    @Column(name = "meter_4color_end")
    private Integer meter4colorEnd = 0;

    @Column(name = "meter_bw_start")
    private Integer meterBwStart = 0;

    @Column(name = "meter_bw_end")
    private Integer meterBwEnd = 0;

    @Column(name = "issue_found", columnDefinition = "TEXT")
    private String issueFound;

    @Column(name = "issue_cause", columnDefinition = "TEXT")
    private String issueCause;

    @Column(name = "work_type", length = 20)
    private String workType;

    @Column(name = "printer_name", length = 100)
    private String printerName;

    @Column(name = "job_category", length = 100)
    private String jobCategory;

    @Column(name = "print_qty_4color")
    private Integer printQty4color = 0;

    @Column(name = "print_qty_bw")
    private Integer printQtyBw = 0;

    @Column(name = "print_qty_total")
    private Integer printQtyTotal = 0;

    @Column(name = "order_print_qty")
    private Integer orderPrintQty = 0;

    @Column(name = "order_produce_qty")
    private Integer orderProduceQty = 0;

    @Column(name = "start_datetime")
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime")
    private LocalDateTime endDatetime;

    @Column(name = "responsible_person", length = 100)
    private String responsiblePerson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "meter_w_start")
    private Integer meterWStart = 0;

    @Column(name = "meter_w_end")
    private Integer meterWEnd = 0;

    @Column(name = "next_meter_4color_start")
    private Integer nextMeter4colorStart = 0;

    @Column(name = "next_meter_4color_end")
    private Integer nextMeter4colorEnd = 0;

    @Column(name = "next_meter_bw_start")
    private Integer nextMeterBwStart = 0;

    @Column(name = "next_meter_bw_end")
    private Integer nextMeterBwEnd = 0;

    @Column(name = "next_meter_w_start")
    private Integer nextMeterWStart = 0;

    @Column(name = "next_meter_w_end")
    private Integer nextMeterWEnd = 0;

    @Column(name = "page2_meter_4color_start")
    private Integer page2Meter4colorStart = 0;

    @Column(name = "page2_meter_4color_end")
    private Integer page2Meter4colorEnd = 0;

    @Column(name = "page2_meter_bw_start")
    private Integer page2MeterBwStart = 0;

    @Column(name = "page2_meter_bw_end")
    private Integer page2MeterBwEnd = 0;

    @Column(name = "page2_meter_w_start")
    private Integer page2MeterWStart = 0;

    @Column(name = "page2_meter_w_end")
    private Integer page2MeterWEnd = 0;

    @Column(name = "next_page2_meter_4color_start")
    private Integer nextPage2Meter4colorStart = 0;

    @Column(name = "next_page2_meter_4color_end")
    private Integer nextPage2Meter4colorEnd = 0;

    @Column(name = "next_page2_meter_bw_start")
    private Integer nextPage2MeterBwStart = 0;

    @Column(name = "next_page2_meter_bw_end")
    private Integer nextPage2MeterBwEnd = 0;

    @Column(name = "next_page2_meter_w_start")
    private Integer nextPage2MeterWStart = 0;

    @Column(name = "next_page2_meter_w_end")
    private Integer nextPage2MeterWEnd = 0;

    @Column(name = "issue_found_page2", columnDefinition = "TEXT")
    private String issueFoundPage2;

    @Column(name = "issue_cause_page2", columnDefinition = "TEXT")
    private String issueCausePage2;

    @Column(name = "next_printer_name", length = 100)
    private String nextPrinterName;

    @Column(name = "next_page2_printer_name", length = 100)
    private String nextPage2PrinterName;

    @Column(name = "page2_printer_name", length = 100)
    private String page2PrinterName;
}