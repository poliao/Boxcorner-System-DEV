package com.boxcorner.boxcorner.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 1 แถวของตารางรายการลา ในรายงาน "แบบบันทึกการลา" (LeaveRecordReport.jrxml)
 * ใช้เป็น bean datasource ให้ Jasper (ชื่อ field ต้องตรงกับ getter)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveReportRow {
    private Integer seq;
    private String reason;
    private String dateFrom;
    private String dateTo;
    private String timeRange;
    private String sickHours;
    private String vacationHours;
    private String personalHours;
    private String approver;
}
