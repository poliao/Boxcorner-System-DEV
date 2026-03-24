package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "print_log_qa")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrintLogQa extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "qc_alignment")
    private Boolean qcAlignment; // พิมพ์ไม่เหลื่อม/ฉากตรง

    @Column(name = "qc_scumming")
    private Boolean qcScumming; // ไม่เกิดสกรัมหรือซับหลัง

    @Column(name = "qc_color_match")
    private Boolean qcColorMatch; // สีตรงตามปรู๊ฟ

    @Column(name = "qc_color_density")
    private Boolean qcColorDensity; // พิมพ์สีไม่ซีดหรือเข้มเกินไป

    @Column(name = "printed_sheet_number")
    private Integer printedSheetNumber; // ใบพิมพ์ที่เท่าไหร่

    @Column(name = "qc_remark", length = 500)
    private String qcRemark; // หมายเหตุ

    @Column(name = "operator_name")
    private String operatorName; // ผู้บันทึก

}
