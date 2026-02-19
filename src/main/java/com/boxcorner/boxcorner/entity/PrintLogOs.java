package com.boxcorner.boxcorner.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "print_logs_os")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrintLogOs extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId; 

    @Column(name = "machine_name")
    private String machineName;

    @Column(name = "temp_fountain")
    private Double tempFountain;

    @Column(name = "ipa_percent")
    private Double ipaPercent;

    @Column(name = "conductivity")
    private Integer conductivity;

    @Column(name = "air_pressure")
    private Double airPressure;

    @Column(name = "flag_has_cmyk")
    private Boolean flagHasCmyk;

    @Column(name = "flag_special_color")
    private Boolean flagSpecialColor;

    @Column(name = "flag_ink_new")
    private Boolean flagInkNew;

    @Column(name = "flag_ink_old")
    private Boolean flagInkOld;

    // Cyan
    @Column(name = "c_lot") private String cLot;
    @Column(name = "c_brand") private String cBrand;

    // Magenta
    @Column(name = "m_lot") private String mLot;
    @Column(name = "m_brand") private String mBrand;

    // Yellow
    @Column(name = "y_lot") private String yLot;
    @Column(name = "y_brand") private String yBrand;

    // Black
    @Column(name = "k_lot") private String kLot;
    @Column(name = "k_brand") private String kBrand;

    // --- 5. การตรวจสอบอุปกรณ์ ---
    @Column(name = "check_plate_condition")
    private Boolean checkPlateCondition;

    @Column(name = "check_blanket_condition")
    private Boolean checkBlanketCondition;

    @Column(name = "check_machine_washed")
    private Boolean checkMachineWashed;

    @Column(name = "ref_proof")
    private Boolean refProof;

    @Column(name = "ref_digital")
    private Boolean refDigital;

    @Column(name = "ref_old_job")
    private Boolean refOldJob;

    @Column(name = "ref_not_serious")
    private Boolean refNotSerious;

    @CreationTimestamp
    @Column(name = "start_time", updatable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LogStatus status; // RUNNING, COMPLETED

    @Column(name = "print_side")
    private String printSide;

    
}
