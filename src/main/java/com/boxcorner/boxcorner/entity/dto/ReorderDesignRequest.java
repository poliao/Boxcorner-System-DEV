package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReorderDesignRequest {
    private String reorderFromJoId;  // JO เดิมที่สั่ง ReOrder มา
    private String joId;             // JO ใหม่
    private String qtId;             // QT ใหม่
    private String qpId;             // QP ใหม่
    private LocalDate deadlineDate;  // วันที่ฝ่ายออกแบบต้องส่งงาน
    private LocalTime deadlineTime;  // เวลาที่ต้องการ
    private String folderName;       // ชื่องาน (copy มาจากเดิม)
    private String jobOwner;         // เจ้าของงาน (copy)
    private String customerName;     // ลูกค้า (copy)
    private String jobDetails;       // รายละเอียด (copy)
    private String remarks;          // หมายเหตุ
}
