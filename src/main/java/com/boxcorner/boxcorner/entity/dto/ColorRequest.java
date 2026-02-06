package com.boxcorner.boxcorner.entity.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ColorRequest {
    private String color;
    private BigDecimal weight;
    private String lot;
}