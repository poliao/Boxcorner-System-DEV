package com.boxcorner.boxcorner.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "printing_logs")
public class PrintingRecordOs extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_datetime")
    private LocalDateTime startDatetime;

    @Column(name = "job_number", length = 50)
    private String jobNumber;

    @Column(name = "customer_name", length = 255)
    private String customerName;

    @Column(name = "machine_name", length = 100)
    private String machineName;

    @Column(name = "technician_name", length = 100)
    private String technicianName;

    @Column(name = "paper_type", length = 100)
    private String paperType;

    @Column(name = "paper_gram")
    private String paperGram;

    @Column(name = "paper_lot", length = 100)
    private String paperLot;

    @Column(name = "water_temp_celsius", precision = 5, scale = 2)
    private BigDecimal waterTempCelsius;

    @Column(name = "ipa_percent", precision = 5, scale = 2)
    private BigDecimal ipaPercent;

    @Column(name = "conductivity_us")
    private Integer conductivityUs;

    @Column(name = "air_pressure_bar", precision = 5, scale = 2)
    private BigDecimal airPressureBar;

    @Column(name = "has_cmyk")
    private Boolean hasCmyk;

    @Column(name = "has_special_color")
    private Boolean hasSpecialColor;

    @Column(name = "ink_age_type", length = 20)
    private String inkAgeType;

    // Ink Details (C, M, Y, K)
    @Column(name = "c_lot_no", length = 100)
    private String cLotNo;
    @Column(name = "c_brand", length = 100)
    private String cBrand;

    @Column(name = "m_lot_no", length = 100)
    private String mLotNo;
    @Column(name = "m_brand", length = 100)
    private String mBrand;

    @Column(name = "y_lot_no", length = 100)
    private String yLotNo;
    @Column(name = "y_brand", length = 100)
    private String yBrand;

    @Column(name = "k_lot_no", length = 100)
    private String kLotNo;
    @Column(name = "k_brand", length = 100)
    private String kBrand;

    // Checklists
    @Column(name = "is_plate_perfect")
    private Boolean isPlatePerfect;

    @Column(name = "is_blanket_ok")
    private Boolean isBlanketOk;

    @Column(name = "is_machine_cleaned")
    private Boolean isMachineCleaned;

    @Column(name = "color_reference_source", length = 50)
    private String colorReferenceSource;

    @Column(name = "decision_authority", length = 100)
    private String decisionAuthority;

    @Column(name = "decider_name", length = 100)
    private String deciderName;

    @Column(name = "decision_remark", columnDefinition = "TEXT")
    private String decisionRemark;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
