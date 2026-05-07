package com.boxcorner.boxcorner.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> deleteLalamoveWallet(@PathVariable Long id) {
        lalamoveWalletRepository.deleteById(id);
        return ResponseEntity.ok().build();
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
    public ResponseEntity<?> deletePettyCashLog(@PathVariable Long id) {
        pettyCashLogRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
