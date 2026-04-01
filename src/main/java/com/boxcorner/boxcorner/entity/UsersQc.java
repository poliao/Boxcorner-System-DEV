package com.boxcorner.boxcorner.entity; // เปลี่ยนตาม package ของคุณ

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users_qc")
@Data
public class UsersQc extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name = "name")
    private String name;

    @Column(name = "department")
    private String department;
   
}