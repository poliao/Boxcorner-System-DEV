package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class StartPrintRequest {
    private Long jobId;
    private Integer printerId;
    private String printSide;
    private String logType;
    private Long meterColorStart;
    private Long meterBwStart;
    private Long meterSpecialStart;
    private String paperReqStart;
    private Long unitStockId;
}