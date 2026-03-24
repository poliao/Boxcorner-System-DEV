package com.boxcorner.boxcorner.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coating_jobs")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class CoatingJob extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobStatus status;

    @Column(name = "jo_id", length = 50, nullable = false)
    private String joId;

    @Column(name = "job_customer_name", length = 255, nullable = false)
    private String jobCustomerName;

    @Column(name = "job_owner_name", length = 100)
    private String jobOwnerName;

    @Column(name = "technician_name", length = 100)
    private String technicianName;

    @Column(name = "delivery_datetime")
    private LocalDateTime deliveryDatetime;

    @Column(name = "order_datetime")
    private LocalDateTime orderDatetime;

    @Column(name = "received_sheets_qty")
    private Integer receivedSheetsQty = 0;

    @Column(name = "required_sheets_qty")
    private Integer requiredSheetsQty = 0;

    @Column(name = "product_job_id", length = 50)
    private String productJobId;

    @Column(name = "is_sample", nullable = false)
    private Boolean isSample = false;


    @Column(name = "pap_order_id")
    private Integer papOrderId;
}
