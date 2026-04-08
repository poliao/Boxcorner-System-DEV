package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Table(name = "proof_orders")
public class ProofOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "production_order_id")
    private Integer productionOrderId;

    // Header
    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "job_code", length = 50)
    private String jobCode;

    @Column(name = "customer_name", length = 255)
    private String customerName;

    @Column(name = "job_name", length = 255)
    private String jobName;

    @Column(name = "ordered_by", length = 100)
    private String orderedBy;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // Plate (งานแม่พิมพ์)
    @Column(name = "plate_location", length = 100)
    private String plateLocation;

    @Column(name = "plate_color_count", length = 50)
    private String plateColorCount;

    @Column(name = "plate_screen_mesh", length = 50)
    private String plateScreenMesh;

    @Column(name = "plate_other_details", length = 500)
    private String plateOtherDetails;

    // Cutting (งานตัดกระดาษ)
    @Column(name = "paper_type", length = 255)
    private String paperType;

    @Column(name = "paper_cut", length = 100)
    private String paperCut;

    @Column(name = "paper_print_size", length = 100)
    private String paperPrintSize;

    @Column(name = "paper_print_qty")
    private Integer paperPrintQty;

    @Column(name = "paper_cutter_name", length = 100)
    private String paperCutterName;

    @Column(name = "paper_special_instructions", length = 500)
    private String paperSpecialInstructions;

    // Printing (งานพิมพ์ออฟเซ็ท)
    @Column(name = "print_schedule_date")
    private LocalDate printScheduleDate;

    @Column(name = "print_delivery_date")
    private LocalDate printDeliveryDate;

    @Column(name = "print_location", length = 100)
    private String printLocation;

    @Column(name = "print_characteristics", length = 255)
    private String printCharacteristics;

    @Column(name = "print_color_count", length = 100)
    private String printColorCount;

    @Column(name = "print_operator_name", length = 100)
    private String printOperatorName;

    @Column(name = "print_qty_obtained")
    private Integer printQtyObtained;

    @Column(name = "print_special_instructions", length = 500)
    private String printSpecialInstructions;

    // Coating (งานเคลือบ)
    @Column(name = "coat_schedule_date")
    private LocalDate coatScheduleDate;

    @Column(name = "coat_location", length = 100)
    private String coatLocation;

    @Column(name = "coat_type", length = 255)
    private String coatType;

    @Column(name = "coat_operator_name", length = 100)
    private String coatOperatorName;

    @Column(name = "coat_qty_obtained")
    private Integer coatQtyObtained;

    @Column(name = "coat_special_instructions", length = 500)
    private String coatSpecialInstructions;

    // Die-cut (งานไดคัท/ปั๊มพิเศษ)
    @Column(name = "diecut_schedule_date")
    private LocalDate diecutScheduleDate;

    @Column(name = "diecut_location", length = 100)
    private String diecutLocation;

    @Column(name = "diecut_type", length = 255)
    private String diecutType;

    @Column(name = "diecut_operator_name", length = 100)
    private String diecutOperatorName;

    @Column(name = "diecut_qty_obtained")
    private Integer diecutQtyObtained;

    @Column(name = "diecut_special_instructions", length = 500)
    private String diecutSpecialInstructions;
}
