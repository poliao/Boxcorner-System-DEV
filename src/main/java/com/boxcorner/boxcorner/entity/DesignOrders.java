package com.boxcorner.boxcorner.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "design_orders")
@Data
public class DesignOrders extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "folder_name")
    private String folderName;

    @Column(name = "job_details")
    private String jobDetails;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "job_owner")
    private String jobOwner;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @Column(name = "deadline_time")
    private LocalTime deadlineTime;

    @Column(name = "assignee")
    private String assignee;

    @Column(name = "process_status")
    private String processStatus;

    @Column(name = "confirm_status")
    private String confirmStatus;

    @Column(name = "note_edit")
    private String noteEdit;

    @Column(name = "confirm_date")
    private LocalDate confirmDate;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "order_time")
    private LocalTime orderTime;

    @Column(name = "jo_id")
    private String JoId;

    @Column(name = "qt_id")
    private String QtId;

    @Column(name = "qp_id")
    private String QpId;

    @Column(name = "version")
    private String version;

    @Column(name = "remark_add")
    private String remarkAdd;

    @Column(name = "assignee_first")
    private String assigneeFirst;

    @Column(name = "start_datetime")
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime")
    private LocalDateTime endDatetime;

    @Column(name = "reorder_from_jo_id")
    private String reorderFromJoId;
}
