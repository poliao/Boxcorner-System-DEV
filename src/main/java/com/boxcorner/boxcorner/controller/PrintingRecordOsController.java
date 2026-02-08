package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.PrintingRecordOs;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.PrintingRecordOsService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/printing-record-os")
public class PrintingRecordOsController {

    @Autowired
    private PrintingRecordOsService service;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrintingRecordOs printingRecord, HttpServletRequest httpRequest) {
        try {
            return ResponseEntity.ok(service.savePrintingRecord(printingRecord,  tokenService.getCurrentUser(httpRequest)));
        }
         catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}