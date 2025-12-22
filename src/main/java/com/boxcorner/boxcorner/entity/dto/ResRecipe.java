package com.boxcorner.boxcorner.entity.dto;

import java.util.List;

import com.boxcorner.boxcorner.entity.Colors;

import jakarta.persistence.Id;
import lombok.Data;

@Data
public class ResRecipe {
    @Id
    private String recipeid;
    private String jobid;
    private String jobname;
    private String updatedate;
    private String updateby;
    private List<Colors> colors;
}
