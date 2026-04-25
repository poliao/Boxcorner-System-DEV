package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.QcJob;
import com.boxcorner.boxcorner.entity.dto.CompleteQcRequest;
import com.boxcorner.boxcorner.service.QcService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qc")
@RequiredArgsConstructor
public class QcController {

    private final QcService qcService;

    @PostMapping("/job")
    public ResponseEntity<?> saveQcJob(@RequestBody QcJob qcJob) {
        try {
            QcJob savedJob = qcService.saveQcJob(qcJob);
            return ResponseEntity.ok(savedJob);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllQcJobs(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "joId", required = false) String joId,
            @RequestParam(value = "jobName", required = false) String jobName,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "qcType", required = false) String qcType,
            @RequestParam(value = "qcLocation", required = false) String qcLocation,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "startFrom", required = false) LocalDate startFrom,
            @RequestParam(value = "startTo", required = false) LocalDate startTo,
            @RequestParam(value = "deliveryFrom", required = false) LocalDate deliveryFrom,
            @RequestParam(value = "deliveryTo", required = false) LocalDate deliveryTo) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
            return ResponseEntity.ok(qcService.getAllQcJobs(joId, jobName, status, qcType, qcLocation, role, startFrom, startTo,
                    deliveryFrom, deliveryTo, pageable));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getQcJobById(@RequestParam(value = "id") Integer id) {
        try {
            return ResponseEntity.ok(qcService.getQcJobById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/start")
    public ResponseEntity<?> startQc(
            @RequestParam(value = "id") Integer id,
            @RequestParam(value = "receivedQty") Integer receivedQty,
            @RequestParam(value = "operatorName") String operatorName,
            @RequestParam(value = "qcType", required = false) String qcType) {
        try {
            return ResponseEntity.ok(qcService.startQc(id, receivedQty, operatorName, qcType));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeQc(@RequestBody CompleteQcRequest request) {
        try {
            return ResponseEntity.ok(qcService.completeQc(
                    request.getId(),
                    request.getPassedQty(),
                    request.getBundlesPerPack(),
                    request.getBoxesPerBundle(),
                    request.getPassedQtyFraction(),
                    request.getBundlesPerPackFraction(),
                    request.getPiecesFraction(),
                    request.getStaffList(),
                    request.getWasteReportList(),
                    request.getQcColorMatch(),
                    request.getQcColorConsistency(),
                    request.getQcInkResidue(),
                    request.getQcInkTransfer(),
                    request.getQcStains(),
                    request.getQcAlignment(),
                    request.getQcScratches(),
                    request.getQcMixedJobs(),
                    request.getQcCaution()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/partial")
    public ResponseEntity<?> partialQc(@RequestBody CompleteQcRequest request) {
        try {
            return ResponseEntity.ok(qcService.partialQc(
                    request.getId(),
                    request.getPassedQty(),
                    request.getBundlesPerPack(),
                    request.getBoxesPerBundle(),
                    request.getPassedQtyFraction(),
                    request.getBundlesPerPackFraction(),
                    request.getPiecesFraction(),
                    request.getStaffList(),
                    request.getWasteReportList(),
                    request.getQcColorMatch(),
                    request.getQcColorConsistency(),
                    request.getQcInkResidue(),
                    request.getQcInkTransfer(),
                    request.getQcStains(),
                    request.getQcAlignment(),
                    request.getQcScratches(),
                    request.getQcMixedJobs(),
                    request.getQcCaution()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
