package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class CalibrateRequest {
    private Integer printerId;
    private String printSide;
    private String logType;
    private Long meterColorStart;
    private Long meterColorEnd;
    private Long meterBwStart;
    private Long meterBwEnd;
    private Long meterSpecialStart;
    private Long meterSpecialEnd;
    private String paperReqStart;
    private String paperReqEnd;
    private String note;
}
