package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReorderSampleRequest {
    private String reorderFromJoId;   // JO เดิมที่สั่ง ReOrder มา
    private String jobId;              // JO ใหม่
    private String qtId;               // QT ใหม่
    private String qpId;               // QP ใหม่
    private LocalDate deliveryDate;    // วันที่กำหนดส่งตัวอย่าง
    private LocalTime deliveryTime;    // เวลาที่ต้องการ
    private Integer quantity;          // จำนวน
    private String unit;               // หน่วย
    private String note;               // หมายเหตุ
    private String folderName;         // ชื่องาน
    private String customerName;       // ลูกค้า
    private String jobOwner;           // เจ้าของงาน
}
