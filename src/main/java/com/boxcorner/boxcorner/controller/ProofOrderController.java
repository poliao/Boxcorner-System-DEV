package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.ProofOrder;
import com.boxcorner.boxcorner.service.ProofOrderService;

@RestController
@RequestMapping("/api/proof-orders")
public class ProofOrderController {

    @Autowired
    private ProofOrderService proofOrderService;

    @GetMapping("/by-production-id/{id}")
    public ResponseEntity<?> getByProductionOrderId(@PathVariable("id") Integer id) {
        return proofOrderService.findByProductionOrderId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProofOrder> save(@RequestBody ProofOrder proofOrder) {
        return ResponseEntity.ok(proofOrderService.save(proofOrder));
    }
}
