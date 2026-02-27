package com.boxcorner.boxcorner.entity.dto;

import lombok.Data;

@Data
public class ReturnPaperRequest {
    private Long printJobId;
    private Long unitStockId;
    private Integer returnQty; // จำนวนแผ่นที่ต้องการคืน (sheets)
    private String note;
}
