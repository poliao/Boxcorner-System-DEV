package com.boxcorner.boxcorner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.HrApprover;
import com.boxcorner.boxcorner.entity.HrPosition;
import com.boxcorner.boxcorner.repository.HrApproverRepository;
import com.boxcorner.boxcorner.repository.HrPositionRepository;

@RestController
@RequestMapping("/api/dcsm45")
public class Dcsm45Controller {

    @Autowired
    private HrPositionRepository positionRepository;

    @Autowired
    private HrApproverRepository approverRepository;

    // ---------------- ตำแหน่ง (Positions) ----------------
    @GetMapping("/positions")
    public ResponseEntity<List<HrPosition>> getPositions() {
        return ResponseEntity.ok(positionRepository.findAll(Sort.by(Sort.Direction.ASC, "id")));
    }

    @PostMapping("/positions")
    public ResponseEntity<HrPosition> createPosition(@RequestBody HrPosition position) {
        position.setId(null);
        HrPosition saved = positionRepository.save(position);
        // สร้างรหัสตำแหน่งอัตโนมัติจาก id เพื่อให้ไม่ซ้ำ เช่น POS-0001
        if (saved.getCode() == null || saved.getCode().isBlank()) {
            saved.setCode(String.format("POS-%04d", saved.getId()));
            saved = positionRepository.save(saved);
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/positions/{id}")
    public ResponseEntity<HrPosition> updatePosition(@PathVariable("id") Long id, @RequestBody HrPosition position) {
        return positionRepository.findById(id).map(existing -> {
            existing.setNameTh(position.getNameTh());
            existing.setNameEn(position.getNameEn());
            return ResponseEntity.ok(positionRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/positions/{id}")
    public ResponseEntity<?> deletePosition(@PathVariable("id") Long id) {
        positionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ---------------- สายการอนุมัติ (Approvers) ----------------
    @GetMapping("/approvers")
    public ResponseEntity<List<HrApprover>> getApprovers() {
        return ResponseEntity.ok(approverRepository.findAll(Sort.by(Sort.Direction.ASC, "id")));
    }

    @PostMapping("/approvers")
    public ResponseEntity<HrApprover> createApprover(@RequestBody HrApprover approver) {
        approver.setId(null);
        return ResponseEntity.ok(approverRepository.save(approver));
    }

    @PutMapping("/approvers/{id}")
    public ResponseEntity<HrApprover> updateApprover(@PathVariable("id") Long id, @RequestBody HrApprover approver) {
        return approverRepository.findById(id).map(existing -> {
            existing.setUserId(approver.getUserId());
            existing.setUserName(approver.getUserName());
            existing.setPositionIds(approver.getPositionIds());
            return ResponseEntity.ok(approverRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/approvers/{id}")
    public ResponseEntity<?> deleteApprover(@PathVariable("id") Long id) {
        approverRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
