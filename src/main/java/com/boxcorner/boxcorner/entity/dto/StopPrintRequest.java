package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class StopPrintRequest {
    private Long logId;       // ID ของ Log ที่กำลังวิ่งอยู่
    private String action;    // "PAUSE" หรือ "FINISH"
    
    private Long meterColorEnd;
    private Long meterBwEnd;
    private Long meterSpecialEnd; // Nullable for Canon
    
    private String paperReqEnd;
    private String note; // หมายเหตุ (Optional)
}