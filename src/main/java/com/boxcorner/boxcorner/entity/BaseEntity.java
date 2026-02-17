package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;

@MappedSuperclass
@Data
public abstract class BaseEntity {

    @Version
    @Column(name = "row_version")
    private Long rowVersion;

    public enum PrinterBrand {
        CANON, RICOH
    }

    public enum PrintSide {
        FRONT, BACK, CALIBRATE
    }

    public enum LogType {
        NORMAL, REPRINT, TEST, CALIBRATE
    }

    public enum JobStatus {
        PENDING, IN_PROGRESS, COMPLETED, PAUSED, WAITPAGE2, IN_PROGRESS_PAGE2, PAUSED_PAGE2
    }
}