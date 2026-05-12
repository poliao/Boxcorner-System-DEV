package com.boxcorner.boxcorner.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.LalamoveCloseRequest;
import com.boxcorner.boxcorner.repository.LalamoveCloseRequestRepository;
import com.boxcorner.boxcorner.repository.LalamoveWalletRepository;

@RestController
@RequestMapping("/api/dcsm43")
public class Dcsm43Controller {

    @Autowired
    private LalamoveWalletRepository lalamoveWalletRepository;

    @Autowired
    private LalamoveCloseRequestRepository closeRequestRepository;

    @GetMapping("/close-requests")
    public ResponseEntity<List<LalamoveCloseRequest>> getCloseRequests() {
        return ResponseEntity.ok(closeRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "requestedAt")));
    }

    @PostMapping("/close-requests")
    public ResponseEntity<LalamoveCloseRequest> createCloseRequest(@RequestBody LalamoveCloseRequest req) {
        return closeRequestRepository.findByJobNo(req.getJobNo()).map(existing -> {
            existing.setReason(req.getReason());
            existing.setRequestedBy(req.getRequestedBy());
            existing.setJobOwner(req.getJobOwner());
            existing.setRequestedAt(LocalDateTime.now());
            existing.setStatus("pending");
            existing.setApprovedBy(null);
            existing.setApprovedAt(null);
            return ResponseEntity.ok(closeRequestRepository.save(existing));
        }).orElseGet(() -> {
            req.setStatus("pending");
            req.setRequestedAt(LocalDateTime.now());
            req.setApprovedBy(null);
            req.setApprovedAt(null);
            return ResponseEntity.ok(closeRequestRepository.save(req));
        });
    }

    @PostMapping("/close-requests/{jobNo}/approve")
    @Transactional
    public ResponseEntity<LalamoveCloseRequest> approveCloseRequest(@PathVariable("jobNo") String jobNo,
            @RequestBody LalamoveCloseRequest body) {
        return closeRequestRepository.findByJobNo(jobNo).map(req -> {
            req.setStatus("approved");
            req.setApprovedBy(body.getApprovedBy());
            req.setApprovedAt(LocalDateTime.now());
            closeRequestRepository.save(req);
            lalamoveWalletRepository.updateJobStatusByJobNo(jobNo, "เสร็จสิ้น");
            return ResponseEntity.ok(req);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
