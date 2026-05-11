package com.boxcorner.boxcorner.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import com.boxcorner.boxcorner.entity.LalamoveWallet;
import com.boxcorner.boxcorner.entity.PettyCashLog;
import com.boxcorner.boxcorner.repository.LalamoveWalletRepository;
import com.boxcorner.boxcorner.repository.PettyCashLogRepository;

@RestController
@RequestMapping("/api/dcsm42")
public class Dcsm42Controller {

    @Autowired
    private LalamoveWalletRepository lalamoveWalletRepository;

    @Autowired
    private PettyCashLogRepository pettyCashLogRepository;

    // Lalamove Wallet Endpoints
    @GetMapping("/lalamove")
    public ResponseEntity<List<LalamoveWallet>> getLalamoveWallets() {
        return ResponseEntity.ok(lalamoveWalletRepository.findAll(Sort.by(Sort.Direction.ASC, "date", "time")));
    }

    @PostMapping("/lalamove")
    public ResponseEntity<LalamoveWallet> createLalamoveWallet(@RequestBody LalamoveWallet wallet) {
        return ResponseEntity.ok(lalamoveWalletRepository.save(wallet));
    }

    @DeleteMapping("/lalamove/{id}")
    public ResponseEntity<?> deleteLalamoveWallet(@PathVariable("id") Long id) {
        lalamoveWalletRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/lalamove/close-by-job/{jobNo}")
    @Transactional
    public ResponseEntity<List<LalamoveWallet>> closeWalletJobByJobNo(@PathVariable("jobNo") String jobNo) {
        int updated = lalamoveWalletRepository.updateJobStatusByJobNo(jobNo, "\u0e40\u0e2a\u0e23\u0e47\u0e08\u0e2a\u0e34\u0e49\u0e19");
        if (updated == 0) return ResponseEntity.notFound().build();
        List<LalamoveWallet> updatedEntries = lalamoveWalletRepository.findByJobNo(jobNo);
        return ResponseEntity.ok(updatedEntries);
    }

    // Petty Cash Endpoints
    @GetMapping("/pettyCash")
    public ResponseEntity<List<PettyCashLog>> getPettyCashLogs() {
        return ResponseEntity.ok(pettyCashLogRepository.findAll(Sort.by(Sort.Direction.ASC, "date", "time")));
    }

    @PostMapping("/pettyCash")
    public ResponseEntity<PettyCashLog> createPettyCashLog(@RequestBody PettyCashLog log) {
        return ResponseEntity.ok(pettyCashLogRepository.save(log));
    }

    @DeleteMapping("/pettyCash/{id}")
    public ResponseEntity<?> deletePettyCashLog(@PathVariable("id") Long id) {
        pettyCashLogRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/pettyCash/close-by-job/{jobNo}")
    @Transactional
    public ResponseEntity<List<PettyCashLog>> closePettyCashJobByJobNo(@PathVariable("jobNo") String jobNo) {
        int updated = pettyCashLogRepository.updateJobStatusByJobNo(jobNo, "เสร็จสิ้น");
        if (updated == 0) return ResponseEntity.notFound().build();
        List<PettyCashLog> updatedEntries = pettyCashLogRepository.findByJobNo(jobNo);
        return ResponseEntity.ok(updatedEntries);
    }
}
