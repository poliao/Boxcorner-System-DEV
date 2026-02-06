package com.boxcorner.boxcorner.entity.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ColorResponse {

    private Integer rowVersion;
    private String colorid;
    private String recipeid;
    private String colorname;
    private BigDecimal weight;
    private String lot;
    private String updatedate;
    private String updateby;
}