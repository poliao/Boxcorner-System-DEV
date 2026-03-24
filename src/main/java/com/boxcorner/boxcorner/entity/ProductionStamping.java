package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "production_stamping")
public class ProductionStamping extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "report_date")
    private LocalDate reportDate;

    @Column(name = "job_order_no", length = 50)
    private String jobOrderNo;

    @Column(name = "job_name", length = 255)
    private String jobName;

    @Column(name = "stamping_type", length = 20)
    private String stampingType;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "total_time", length = 50)
    private String totalTime;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "reporter_name", length = 100)
    private String reporterName;

}
