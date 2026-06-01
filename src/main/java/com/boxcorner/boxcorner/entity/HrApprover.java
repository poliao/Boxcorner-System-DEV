package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hr_approver")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrApprover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user.id (เก็บเป็น text) จาก /api/user/all -> OptionDTO.value
    @Column(name = "user_id")
    private String userId;

    // username สำหรับแสดงผล จาก OptionDTO.text
    @Column(name = "user_name")
    private String userName;

    // ตำแหน่งที่ผู้อนุมัติคนนี้อนุมัติได้ (1 ผู้อนุมัติ -> หลายตำแหน่ง)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "hr_approver_position", joinColumns = @JoinColumn(name = "approver_id"))
    @Column(name = "position_id")
    private List<Long> positionIds = new ArrayList<>();
}
