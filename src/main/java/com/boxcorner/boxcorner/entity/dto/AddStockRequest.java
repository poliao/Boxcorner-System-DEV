package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class AddStockRequest {
    private Double qty;
    private Integer uomId;
    private String note;
}
