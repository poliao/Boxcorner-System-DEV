package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotations", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "quote_number", "revision" }) // ห้ามเลขที่ใบเสนอราคาและ Revision ซ้ำกัน
})
@Data // ใช้ Lombok สร้าง Getter/Setter อัตโนมัติ
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quoteId; // PK ของระบบ

    // เชื่อมโยงกับ SalesActivity (เก็บแค่ ID เพื่อความง่ายในการ Save)
    @Column(name = "activity_id", nullable = false)
    private Long activityId;

    // --- ส่วนข้อมูลเอกสาร ---
    @Column(name = "quote_number", nullable = false, length = 50)
    private String quoteNumber; // เลขที่ใบเสนอราคา (เช่น QT-69001)

    @Column(name = "revision", nullable = false)
    private Integer revision = 0; // ครั้งที่แก้ไข (0=ใบแรก)

    // --- ส่วนตัวเลขการเงิน (จากภาพที่คุณส่งมา) ---
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount; // ยอดขายรวม (กล่องสีน้ำเงิน 11,321 บาท) -> *ใช้คิด KPI*

    @Column(precision = 15, scale = 2)
    private BigDecimal cost; // ต้นทุนรวม (ยอด 8,708 บาท) -> *เก็บไว้ดู Margin*

    // --- สถานะและ Version Control ---
    @Column(length = 20)
    private String status = "PENDING"; // สถานะ: PENDING, APPROVED, REJECTED

    @Column(name = "is_current", nullable = false)
    private Boolean isCurrent = true; // เป็นใบเวอร์ชันล่าสุดหรือไม่?

    @Column(columnDefinition = "TEXT")
    private String remark;

    @Version // สำหรับ Optimistic Locking (ป้องกัน Save ชนกัน)
    @Column(name = "row_version")
    private Long rowVersion;

    @CreationTimestamp // บันทึกเวลาอัตโนมัติเมื่อ Insert
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- Helper Method (Optional) ---
    // คำนวณกำไรเบื้องต้น (เผื่อเรียกใช้ใน Java)
    public BigDecimal getProfit() {
        if (amount == null || cost == null)
            return BigDecimal.ZERO;
        return amount.subtract(cost);
    }
}