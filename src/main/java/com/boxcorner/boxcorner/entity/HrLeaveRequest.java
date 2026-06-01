package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "hr_leave_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrLeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "employee_name")
    private String employeeName;

    // ลาป่วย / ลากิจ / ลาคลอด / ลาบวช / ลาพักร้อน
    @Column(name = "leave_type")
    private String leaveType;

    @Column(name = "date_from")
    private LocalDate dateFrom;

    @Column(name = "date_to")
    private LocalDate dateTo;

    // เก็บเป็น String "HH:mm"
    @Column(name = "time_from")
    private String timeFrom;

    @Column(name = "time_to")
    private String timeTo;

    @Column(length = 1000)
    private String reason;

    // หมายเหตุ: ไฟล์แนบยังไม่ถูกบันทึกลง DB (ตามสเปก) จึงไม่มีคอลัมน์ไฟล์
}
