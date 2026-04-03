package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReorderProductionRequest {
    private String reorderFromJoId;   // JO เดิมที่สั่ง ReOrder มา
    private String jobId;              // JO ใหม่
    private String qtId;               // QT ใหม่
    private String qpId;               // QP ใหม่
    private LocalDate deadlineDate;    // วันที่กำหนดส่งงาน
    private LocalTime deadlineTime;    // เวลาที่ต้องการ
    private String remarks;            // หมายเหตุ
    private String folderName;         // ชื่องาน
    private String customerName;       // ลูกค้า
    private String jobOwner;           // เจ้าของงาน
    private String decisionAuthority;  // ผู้มีอำนาจตัดสินใจ
    private String decisionAuthorityRemarks; // หมายเหตุผู้มีอำนาจตัดสินใจ
    
    // Technical Specification Fields (Sample Physical Details)
    private String searchId;
    private String sampleJobType;
    private String samplePrintingSystem;
    private String samplePrintingStyle;
    private String samplePrintingColor;
    private String samplePaperSize;
    private String samplePaperGrammage;
    private String sampleCoatingStyle;
    private String sampleDiecutStyle;
    private String sampleSpecialInstructions;
    private java.time.LocalDateTime sampleDeliveryTimestamp;
}
