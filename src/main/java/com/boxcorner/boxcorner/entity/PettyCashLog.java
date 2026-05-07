package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "petty_cash_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PettyCashLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cash_type", nullable = false)
    private String cashType; // 'topup', 'expense'

    @Column(name = "menu_key", nullable = false)
    private String menuKey; // 'transportCash', 'officeCash'

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    private String withdrawer;
    
    private String approver;
    
    private String department;
    
    private String category;

    @Column(name = "job_no")
    private String jobNo;

    private String description;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    private String recorder;
    
    private String note;
}
