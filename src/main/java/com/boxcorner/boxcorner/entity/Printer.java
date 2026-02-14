package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "printers")
@Data
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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}