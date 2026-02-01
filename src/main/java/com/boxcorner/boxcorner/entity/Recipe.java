package com.boxcorner.boxcorner.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "recipe")
@Data
public class Recipe extends BaseEntity {

    @Id
    private String recipeid;
    private String jobid;
    private String jobname;
    private String updatedate;
    private String updateby;
    private BigDecimal reqtotalweight;
    private BigDecimal lightness;
    private BigDecimal greenred;
    private BigDecimal blueyellow;
}
