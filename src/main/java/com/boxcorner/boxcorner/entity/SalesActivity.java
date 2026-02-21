package com.boxcorner.boxcorner.entity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "sales_activities")
@Data
public class SalesActivity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    @Column(nullable = false)
    private LocalDate activityDate = LocalDate.now();

    @Column(nullable = false)
    private String customerName;

    private String contactPerson;
    private String contactChannel;
    
    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(columnDefinition = "TEXT")
    private String discussionResult;

    private Boolean isNewCustomer = false;

    private Boolean quotation = false;

    @Column(columnDefinition = "TEXT")
    private String nextStep;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String contact;

    private String salesName;
    private LocalDate nextDate;
    private LocalTime nextTime;
    private String companyName;
    
}