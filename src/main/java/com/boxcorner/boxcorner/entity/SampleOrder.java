package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Builder
@Entity
@Table(name = "sample_orders")
public class SampleOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "folder_name", length = 255)
    private String folderName;

    @Column(name = "job_owner", length = 150)
    private String jobOwner;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "delivery_time")
    private LocalTime deliveryTime;

    @Column(name = "responsible_person", length = 150)
    private String responsiblePerson;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "is_create_sample")
    private Boolean isCreateSample;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "note_edit")
    private String noteEdit;

    @Column(name = "design_order_id")
    private Integer designOrderId;

    @Column(name = "update_date_delivery")
    private LocalDate updateDateDelivery;
    
    @Column(name = "update_time_delivery")
    private LocalTime updateTimeDelivery;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "cancel_remarks")
    private String cancelRemarks;

    @Column(name = "job_type")
    private String jobType;

    @Column(name = "print_type")
    private String printType;
    
    @Column(name = "paper_type")
    private String paperType;
    
    @Column(name = "diecutting_type")
    private String diecuttingType;

    @Column(name = "coat_type")
    private String coatType;
    
    @Column(name = "system_print")
    private String systemPrint;

    @Column(name = "color_print")
    private String colorPrint;

    @Column(name = "paper_gram")
    private String paperGram;

    @Column(name = "job_id")
    private String jobId;

    @Column(name = "qt_id")
    private String qtId;

    @Column(name = "machine_name")
    private Boolean machineName;

    @Column(name = "print2_page")
    private Boolean print2Page;

    @Column(name = "order_time")
    private LocalTime orderTime;
}