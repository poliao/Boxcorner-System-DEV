package com.boxcorner.boxcorner.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
}