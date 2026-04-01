package com.boxcorner.boxcorner.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "od_cut_papers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class OdCutPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id")
    private Lot lot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @Column(name = "cut_pieces_per_sheet")
    private Integer cutPiecesPerSheet;

    @Column(name = "large_sheets_taken")
    private Double largeSheetsTaken;

    @Column(name = "total_small_sheets_created")
    private Integer totalSmallSheetsCreated;

    @Column(name = "remaining_small_sheets")
    private Integer remainingSmallSheets;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_from_job_id")
    private PrintJob createdFromJob;

    public enum Status {
        AVAILABLE, DEPLETED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "operator_name", length = 100)
    private String operatorName;
}
