package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class FinishPrintRequest {
    private Long logId; // สำคัญมาก! ต้องรู้ว่าจะไปจบ Log ตัวไหน
    
    // Meter End
    private Long meterColorEnd;
    private Long meterBwEnd;
    private Long meterSpecialEnd; // Ricoh only
    
    // Paper End
    private String paperReqEnd;
}