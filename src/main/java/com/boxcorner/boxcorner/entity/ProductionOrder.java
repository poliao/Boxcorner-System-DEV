package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "production_orders") 
public class ProductionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "folder_name", nullable = false)
    private String folderName; 

    @Column(name = "used_file")
    private String usedFile;

    @Column(name = "color_sample")
    private String colorSample;

    @Column(name = "job_owner")
    private String jobOwner;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate; 

    @Column(name = "deadline_time")
    private LocalTime deadlineTime; 

    @Column(name = "delivery_date")
    private LocalDate deliveryDate; 

    @Column(name = "job_status")
    private String jobStatus; 

    @Column(name = "process_status")
    private String processStatus;

    @Column(name = "operator_name")
    private String operatorName; 

    @Column(name = "inspection_date")
    private LocalDate inspectionDate; 

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "mold_status")
    private String moldStatus; 

    @Column(name = "job_type")
    private String jobType; 

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @Column(name = "sample_order_id")
    private Integer sampleOrderId;

    @Column(name = "mold_maker_name")
    private String moldMakerName;

    @Column(name = "printing_machine")
    private String printingMachine;

    @Column(name = "inspector")
    private String inspector;

    @Column(name = "postpone")
    private String postpone;

}