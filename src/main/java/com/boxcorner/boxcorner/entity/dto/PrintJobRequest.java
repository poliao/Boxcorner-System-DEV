package com.boxcorner.boxcorner.entity.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.boxcorner.boxcorner.entity.BaseEntity.JobStatus;

import lombok.Data;

@Data
public class PrintJobRequest {
    
    private Long id;
    private LocalDate createdAt;
    private String jobId;
    private LocalDate deliveryDate;
    private String customerJobName;
    private JobStatus jobStatus;
    private Integer totalPrintSheets;
    private Integer productionQty;
    private String printerName;
    private Integer setupWast;
    private String sampleRefNo;
    private LocalTime deliveryTime;
    private Boolean issample;
    private String jobType;
    private String printType;
    private String paperType;
    private String diecuttingType;
    private String coatType;
    private String systemPrint;
    private String colorPrint;
    private String paperGram;
    private String printingRecordId;
    private String sampleId;
    private String productionJobId;
    private Boolean print2Page;
    private String typeJob;
    private String productionOrderId;
    private String decisionAuthority;
    private String decisionAuthorityRemarks;
}
