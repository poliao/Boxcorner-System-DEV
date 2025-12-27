package com.boxcorner.boxcorner.entity.dto;

import lombok.AllArgsConstructor; // 1. เพิ่ม import
import lombok.Data;
import lombok.NoArgsConstructor; // 2. เพิ่ม import

@Data
@AllArgsConstructor // 3. จำเป็นมาก: สร้าง Constructor(value, text) ให้ Hibernate เรียกใช้
@NoArgsConstructor  // 4. ควรมีไว้: สำหรับการทำงานทั่วไป
public class OptionDTO {
    
    // @Id  <-- ลบออกได้ครับ DTO ไม่ใช่ Entity ไม่จำเป็นต้องมี @Id
    private String value;
    private String text;
}