package com.boxcorner.boxcorner.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDTO {
    private Integer materialId;
    private String materialCode;
    private String materialName;
    private String baseUomName;
    private Double totalBaseQty;
    private String largeUomName;
    private Double multiplier;
}
