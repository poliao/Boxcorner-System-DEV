package com.boxcorner.boxcorner.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.Data;

@MappedSuperclass
@Data
public abstract class BaseEntity {

    @Version
    @Column(name = "row_version")
    private Long rowVersion;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PrinterBrand {
        CANON, RICOH
    }

    public enum PrintSide {
        FRONT, BACK, CALIBRATE, REPAIR
    }

    public enum LogType {
        NORMAL, REPRINT, TEST, CALIBRATE, EXTRA, REPAIR
    }

    public enum JobStatus {
        PENDING, IN_PROGRESS, COMPLETED, PAUSED, WAITPAGE2, IN_PROGRESS_PAGE2, PAUSED_PAGE2, PROOF, PROOFCOMPLETED,
        PROOF_WAITPAGE2, PROOF_PAGE2,
        CANCEL
    }

    public enum InkCondition {
        NEW, OLD
    }

    public enum ColorReferenceSource {
        PROOF, DIGITAL_FILE, OLD_JOB, NOT_SERIOUS
    }

    public enum LogStatus {
        RUNNING, COMPLETED
    }
}