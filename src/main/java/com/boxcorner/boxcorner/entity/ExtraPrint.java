package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "extra_prints")
public class ExtraPrint extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // การเชื่อมโยงแบบ Many-to-One กลับไปยัง Entity ของงานพิมพ์หลัก
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "print_job_id", nullable = false)
    // private PrintJob printJob; 

    @Column(name = "print_job_id", nullable = false)
    private Long printJobId;

    @Column(name = "additional_qty", nullable = false)
    private Integer additionalQty;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(length = 50)
    @Builder.Default
    private String status = "PENDING"; 

    @Column(name = "requested_by")
    private String requestedBy;

}