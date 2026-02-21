package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.SalesActivity;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.SalesActivityService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/salesActivities")
public class SalesActivityController {

    @Autowired
    private SalesActivityService salesActivityService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody SalesActivity activity, HttpServletRequest request) {
        try {
            return ResponseEntity.ok(salesActivityService.saveOrUpdate(activity,tokenService.getCurrentUser(request)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SalesActivity>> search(
            @RequestParam(value = "activityId", required = false) Long activityId,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "contactPerson", required = false) String contactPerson,
            @RequestParam(value = "isNewCustomer", required = false) Boolean isNewCustomer,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        Page<SalesActivity> result = salesActivityService.search(
            activityId,
            customerName,
            contactPerson,
            isNewCustomer,
            startDate,
            endDate,
            page,
            size
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getById")
    public ResponseEntity<SalesActivity> getById(@RequestParam("id") Long id) {
        return salesActivityService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id) {
        try {
            salesActivityService.delete(id);
            return ResponseEntity.ok("ลบข้อมูลสำเร็จ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
