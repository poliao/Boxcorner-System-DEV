package com.boxcorner.boxcorner.entity.dto;

import com.boxcorner.boxcorner.entity.QcStaff;
import lombok.Data;
import java.util.List;

@Data
public class CompleteQcRequest {
    private Integer id;
    private Integer passedQty;
    private Integer bundlesPerPack;
    private Integer boxesPerBundle;
    private List<QcStaff> staffList;
}
