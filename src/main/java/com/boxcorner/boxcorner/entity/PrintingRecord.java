package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "printing_records")
@Data // ใช้ Lombok สำหรับ Getter/Setter
public class PrintingRecord extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "reference_id", length = 50)
    private String referenceId;

    @Column(name = "delivery_table_id")
    private Integer deliveryTableId;

    @Column(name = "job_id", nullable = false, length = 50)
    private String jobId;

    // ค่ามิเตอร์
    @Column(name = "meter_4color_start")
    private Integer meter4colorStart = 0;

    @Column(name = "meter_4color_end")
    private Integer meter4colorEnd = 0;

    @Column(name = "meter_bw_start")
    private Integer meterBwStart = 0;

    @Column(name = "meter_bw_end")
    private Integer meterBwEnd = 0;

    // ปัญหาและการแก้ไข
    @Column(name = "issue_found", columnDefinition = "TEXT")
    private String issueFound;

    @Column(name = "issue_cause", columnDefinition = "TEXT")
    private String issueCause;

    // รายละเอียดงาน
    @Column(name = "work_type", length = 20)
    private String workType;

    @Column(name = "printer_name", length = 100)
    private String printerName;

    @Column(name = "job_category", length = 100)
    private String jobCategory;

    // จำนวนที่ผลิต (แนะนำให้คำนวณก่อน Save)
    @Column(name = "print_qty_4color")
    private Integer printQty4color = 0;

    @Column(name = "print_qty_bw")
    private Integer printQtyBw = 0;

    @Column(name = "print_qty_total")
    private Integer printQtyTotal = 0;

    // ข้อมูลจากใบสั่งงาน
    @Column(name = "order_print_qty")
    private Integer orderPrintQty = 0;

    @Column(name = "order_produce_qty")
    private Integer orderProduceQty = 0;

    // เวลา
    @Column(name = "start_datetime")
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime")
    private LocalDateTime endDatetime;

    @Column(name = "responsible_person", length = 100)
    private String responsiblePerson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}