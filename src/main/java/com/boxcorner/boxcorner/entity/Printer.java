package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "printers")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Printer extends BaseEntity  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrinterBrand brand; // CANON, RICOH

    @Column(name = "has_special_color")
    @Builder.Default
    private Boolean hasSpecialColor = false; // True = Ricoh

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

}