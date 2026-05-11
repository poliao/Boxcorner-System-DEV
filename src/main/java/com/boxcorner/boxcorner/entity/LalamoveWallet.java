package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "lalamove_wallet")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LalamoveWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private String type; // 'carry', 'topup', 'expense', 'other'

    @Column(name = "payment_type")
    private String paymentType;

    @Column(name = "job_status")
    private String jobStatus;

    @Column(name = "job_no")
    private String jobNo;

    private String customer;

    private String description;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    private String recorder;

    private String note;
}
