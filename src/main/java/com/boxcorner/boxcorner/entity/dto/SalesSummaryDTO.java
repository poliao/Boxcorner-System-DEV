package com.boxcorner.boxcorner.entity.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesSummaryDTO {
    private String salesName;
    private Long visitCount;
    private Long quotationCount;
    private BigDecimal totalSales;
    private Long newCustomerCount;
}
