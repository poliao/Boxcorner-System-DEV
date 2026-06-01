package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hr_position")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HrPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // รหัสตำแหน่ง สร้างอัตโนมัติ เช่น POS-0001
    @Column(unique = true)
    private String code;

    // ชื่อตำแหน่งภาษาไทย
    @Column(name = "name_th", nullable = false)
    private String nameTh;

    // ชื่อตำแหน่งภาษาอังกฤษ
    @Column(name = "name_en")
    private String nameEn;
}
