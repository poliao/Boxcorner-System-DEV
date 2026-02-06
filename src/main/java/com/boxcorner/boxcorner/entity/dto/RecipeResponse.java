package com.boxcorner.boxcorner.entity.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class RecipeResponse {

    private String recipeid;
    private String jobid;
    private String jobname;
    private String updatedate;
    private String updateby;
    private BigDecimal reqtotalweight;
    private BigDecimal lightness;
    private BigDecimal greenred;
    private BigDecimal blueyellow;
    private BigDecimal density;

    private List<ColorResponse> colors;
}