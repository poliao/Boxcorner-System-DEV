package com.boxcorner.boxcorner.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.SampleOrder;
import com.boxcorner.boxcorner.service.SampleOrderService;

@RestController
@RequestMapping("/api/sample-orders")
public class SampleOrderController {

    private final SampleOrderService sampleOrderService;

    public SampleOrderController(SampleOrderService sampleOrderService) {
        this.sampleOrderService = sampleOrderService;
    }

    @PostMapping("/create")
    public ResponseEntity<SampleOrder> createOrder(@RequestBody SampleOrder sampleOrder) {
        SampleOrder newOrder = sampleOrderService.saveOrUpdateOrder(sampleOrder);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

}