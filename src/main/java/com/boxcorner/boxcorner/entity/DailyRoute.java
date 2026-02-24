package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "daily_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    // ข้อมูลตอนเริ่มงาน
    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "start_lat", precision = 10, scale = 7)
    private BigDecimal startLat;

    @Column(name = "start_lng", precision = 10, scale = 7)
    private BigDecimal startLng;

    // ข้อมูลตอนเลิกงาน
    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "end_lat", precision = 10, scale = 7)
    private BigDecimal endLat;

    @Column(name = "end_lng", precision = 10, scale = 7)
    private BigDecimal endLng;

    // ระยะทางรวม
    @Column(name = "total_distance_km", precision = 8, scale = 2)
    private BigDecimal totalDistanceKm;

    // ความสัมพันธ์ One-to-Many: 1 วันมีหลายกิจกรรม
    @OneToMany(mappedBy = "dailyRoute", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalesActivity> salesActivities = new ArrayList<>();
}