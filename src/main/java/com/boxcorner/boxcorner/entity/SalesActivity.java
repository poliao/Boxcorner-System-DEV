package com.boxcorner.boxcorner.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sales_activities")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
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


    @Column(columnDefinition = "TEXT")
    private String contact;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_in_lat", precision = 10, scale = 7)
    private BigDecimal checkInLat;

    @Column(name = "check_in_lng", precision = 10, scale = 7)
    private BigDecimal checkInLng;

    // FK relationship — ใช้ LAZY fetch ป้องกัน circular reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_route_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnoreProperties({ "salesActivities", "hibernateLazyInitializer", "handler" })
    private DailyRoute dailyRoute;

    // ดึงค่า FK โดยตรง (read-only) เพื่อให้เห็นใน JSON response
    @Column(name = "daily_route_id", insertable = false, updatable = false)
    private Long dailyRouteId;

    private String salesName;
    private LocalDate nextDate;
    private LocalTime nextTime;
    private String companyName;
    private String province;
    private String activitiesStatus;
    private String lossReasons;
    private String probability;
}