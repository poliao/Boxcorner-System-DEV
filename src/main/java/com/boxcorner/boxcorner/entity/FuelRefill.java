package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_refills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelRefill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "refill_time", nullable = false)
    private LocalDateTime refillTime;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "odometer", precision = 10, scale = 2, nullable = false)
    private BigDecimal odometer;
}
