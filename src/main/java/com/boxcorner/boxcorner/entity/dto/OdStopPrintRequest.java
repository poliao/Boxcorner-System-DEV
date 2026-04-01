package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class OdStopPrintRequest {
    private Long logId; 
    private String action; // "PAUSE" หรือ "FINISH", "WAITPAGE2", "FINISH_PAGE2", "PAUSED_PAGE2"

    private Long meterColorEnd;
    private Long meterBwEnd;
    private Long meterSpecialEnd; 

    private String note; 
    
    private Integer goodQty;
    private Integer wasteQty;
}
