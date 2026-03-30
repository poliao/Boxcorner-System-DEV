package com.boxcorner.boxcorner.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitStockDTO {
    private Long id;
    private String itemName;
    private String category;
    private String paperSize;
    private BigDecimal currentMajorQty;
    private BigDecimal currentMinorQty;
    private String majorUnit;
    private String minorUnit;
}
