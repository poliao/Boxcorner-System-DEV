package com.boxcorner.boxcorner.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "od_cut_paper_usage_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class OdCutPaperUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "od_cut_paper_id", nullable = false)
    private OdCutPaper odCutPaper;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = true)
    private PrintJob job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "print_log_id", nullable = true)
    private PrintLog printLog;

    @Column(name = "used_sheets", nullable = false)
    private Integer usedSheets;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "operator_name", length = 100)
    private String operatorName;
}
