package com.boxcorner.boxcorner.entity.dto;

import java.util.List;

import com.boxcorner.boxcorner.entity.QcRemainingDestroyStaff;

import lombok.Data;

@Data
public class RemainingDestroyRequest {
    private Integer qcJobId;
    private Integer totalPieces;
    private Integer destroyQty;
    private Integer bundlesPerPack;
    private Integer boxesPerBundle;
    private Integer destroyQtyFraction;
    private Integer bundlesPerPackFraction;
    private Integer piecesFraction;
    private String remarks;
    private List<QcRemainingDestroyStaff> staffList;
}
