package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class OdStartPrintRequest {
    private Long jobId;
    private Integer printerId;
    private String printSide;
    private String logType;
    private Long meterColorStart;
    private Long meterBwStart;
    private Long meterSpecialStart;
    
    // Paper Selection
    private String paperSourceType; // "NEW_CUT" or "EXISTING_CUT" or "NO_PAPER"
    
    // If NEW_CUT
    private Integer lotId;
    private Double largeSheetsTaken;
    private Integer cutMultiplier;

    // If EXISTING_CUT
    private Long odCutPaperId;
}
