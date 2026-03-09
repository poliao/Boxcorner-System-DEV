package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coating_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class CoatingLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "coating_job_id")
    private Integer coatingJobId;

    @Column(name = "jo_id", length = 50)
    private String joId;

    @Column(name = "job_customer_name", length = 255)
    private String jobCustomerName;

    @Column(name = "coating_type", length = 20)
    private String coatingType;

    @Column(name = "laminating_temp", length = 20)
    private String laminatingTemp;

    @Column(name = "film_stock_id")
    private Long filmStockId;

    @Column(name = "film_stock_name", length = 255)
    private String filmStockName;

    @Column(name = "paper_length", length = 50)
    private String paperLength;

    @Column(name = "sheet_qty")
    private Integer sheetQty;

    @Column(name = "report_date")
    private LocalDate reportDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "technician_name", length = 100)
    private String technicianName;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
