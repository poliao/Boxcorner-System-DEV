package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "hr_employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // รหัสพนักงาน สร้างอัตโนมัติ เช่น EMP-0001
    @Column(unique = true)
    private String code;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    // ตำแหน่ง อ้างอิง hr_position.id (จาก Dcsm45)
    @Column(name = "position_id")
    private Long positionId;

    // บัญชีผู้ใช้ (username) ที่ผูกกับพนักงานคนนี้ — ใช้ขอลาได้เฉพาะของตัวเอง
    @Column(name = "username")
    private String username;

    // เงินเดือนต่อเดือน (รายวัน = /30, รายชั่วโมง = รายวัน/8 คำนวณฝั่ง UI)
    @Column(name = "monthly_salary", precision = 12, scale = 2)
    private BigDecimal monthlySalary;

    // สิทธิการลา: วัน + ชั่วโมง (1 วัน = 8 ชม.)
    @Column(name = "personal_leave_days")
    private Integer personalLeaveDays;
    @Column(name = "personal_leave_hours")
    private Integer personalLeaveHours;

    @Column(name = "sick_leave_days")
    private Integer sickLeaveDays;
    @Column(name = "sick_leave_hours")
    private Integer sickLeaveHours;

    @Column(name = "vacation_leave_days")
    private Integer vacationLeaveDays;
    @Column(name = "vacation_leave_hours")
    private Integer vacationLeaveHours;

    @Column(name = "maternity_leave_days")
    private Integer maternityLeaveDays;
    @Column(name = "maternity_leave_hours")
    private Integer maternityLeaveHours;

    @Column(name = "ordination_leave_days")
    private Integer ordinationLeaveDays;
    @Column(name = "ordination_leave_hours")
    private Integer ordinationLeaveHours;
}
