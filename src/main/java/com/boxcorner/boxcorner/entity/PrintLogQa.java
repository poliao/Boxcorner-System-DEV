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

    @Column(name = "qc_color_match")
    private Boolean qcColorMatch; // สีตรงตาม OK Sheet / ตัวอย่าง

    @Column(name = "qc_color_consistency")
    private Boolean qcColorConsistency; // สีสม่ำเสมอ ไม่ด่าง

    @Column(name = "qc_ink_residue")
    private Boolean qcInkResidue; // ไม่มีขี้หมึก

    @Column(name = "qc_ink_transfer")
    private Boolean qcInkTransfer; // ไม่มีซับหลัง

    @Column(name = "qc_stains")
    private Boolean qcStains; // ไม่มีรอยเปื้อน / รอยเลอะหมึก

    @Column(name = "qc_alignment")
    private Boolean qcAlignment; // ไม่ตกทะเบียน / ไม่เบลอ

    @Column(name = "qc_scratches")
    private Boolean qcScratches; // ไม่มีรอยขีด / รอยครูด / รอยปาด

    @Column(name = "qc_mixed_jobs")
    private Boolean qcMixedJobs; // ไม่มีงานปน / หน้าหลังถูกต้อง

    @Column(name = "printed_sheet_number")
    private Integer printedSheetNumber; // ใบพิมพ์ที่เท่าไหร่

    @Column(name = "qc_remark", length = 500)
    private String qcRemark; // หมายเหตุ

    @Column(name = "operator_name")
    private String operatorName; // ผู้บันทึก

}
