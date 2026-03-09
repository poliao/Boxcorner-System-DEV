package com.boxcorner.boxcorner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.CoatingLog;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.CoatingLogService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/coating-log")
public class CoatingLogController {

    @Autowired
    private CoatingLogService service;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/create")
    public ResponseEntity<CoatingLog> create(@RequestBody CoatingLog logEntry, HttpServletRequest request) {
        return ResponseEntity.ok(service.save(logEntry, tokenService.getCurrentUser(request)));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<CoatingLog>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "joId", required = false) String joId,
            @RequestParam(value = "technicianName", required = false) String technicianName) {
        return ResponseEntity.ok(service.getAll(page, size, id, joId, technicianName));
    }

    @GetMapping("/getById")
    public ResponseEntity<CoatingLog> getById(@RequestParam(value = "id") Integer id) {
        CoatingLog logEntry = service.getById(id);
        if (logEntry != null) {
            return ResponseEntity.ok(logEntry);
        }
        return ResponseEntity.notFound().build();
    }
}
