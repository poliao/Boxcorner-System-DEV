package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.SampleOrder;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.SampleOrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/sampleOrders")
public class SampleOrderController {

    @Autowired
    private SampleOrderService sampleOrderService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/create")
    public ResponseEntity<SampleOrder> createOrder(@RequestBody SampleOrder sampleOrder , HttpServletRequest httpRequest) {
        SampleOrder newOrder = sampleOrderService.saveOrUpdateOrder(sampleOrder,tokenService.getCurrentUser(httpRequest));
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SampleOrder>> searchOrders(
            // เพิ่ม value = "..." ให้ครบทุกตัวครับ
            @RequestParam(value = "folderName", required = false) String folderName,
            @RequestParam(value = "jobOwner", required = false) String jobOwner,
            @RequestParam(value = "responsiblePerson", required = false) String responsiblePerson,
            @RequestParam(value = "status", required = false) String status,

            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<SampleOrder> result = sampleOrderService.getAll(
                folderName,
                jobOwner,
                responsiblePerson,
                status,
                startDate,
                endDate,
                page,
                size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getById")
    public ResponseEntity<SampleOrder> getById(@RequestParam("id") Integer id) {
        return sampleOrderService.getSampleOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}