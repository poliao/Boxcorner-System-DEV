package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "qc_waste_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QcWasteReport extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "qc_job_id")
    private Integer qcJobId;

    @Column(name = "process_name", length = 100)
    private String processName; // งานพิมพ์, งานเคลือบ, งานปั้ม, งานปะ

    @Column(name = "technician_name", length = 100)
    private String technicianName; // ช่างยอดที่เสีย

    @Column(name = "waste_qty")
    private Integer wasteQty;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
