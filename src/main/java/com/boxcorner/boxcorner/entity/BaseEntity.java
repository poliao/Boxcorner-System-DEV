package com.boxcorner.boxcorner.entity;

import jakarta.persistence.*;
import lombok.Data;

@MappedSuperclass
@Data
public abstract class BaseEntity {
    
    @Version
    @Column(name = "row_version")
    private Long rowVersion;
}