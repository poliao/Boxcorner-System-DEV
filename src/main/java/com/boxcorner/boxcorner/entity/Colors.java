package com.boxcorner.boxcorner.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "colors")
public class Colors {
    @Id
    private String colorid;
    private String recipeid;
    private String colorname;
    private BigDecimal weight;
    private String lot;
    private String updatedate;
    private String updateby;
}
