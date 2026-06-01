package com.boxcorner.boxcorner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.boxcorner.boxcorner.entity.HrLeaveRequest;
import com.boxcorner.boxcorner.repository.HrLeaveRequestRepository;

@RestController
@RequestMapping("/api/leave-request")
public class LeaveRequestController {

    @Autowired
    private HrLeaveRequestRepository leaveRequestRepository;

    @GetMapping
    public ResponseEntity<List<HrLeaveRequest>> getAll() {
        return ResponseEntity.ok(leaveRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "id")));
    }

    @PostMapping
    public ResponseEntity<HrLeaveRequest> create(@RequestBody HrLeaveRequest req) {
        req.setId(null);
        return ResponseEntity.ok(leaveRequestRepository.save(req));
    }
}
