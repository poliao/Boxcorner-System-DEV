package com.boxcorner.boxcorner.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<?> create(@RequestBody SalesActivity activity, Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(salesActivityService.saveOrUpdate(activity, username));
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
            @RequestParam(value = "startDateMain", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDateMain,
            @RequestParam(value = "endDateMain", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDateMain,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest httpRequest) {
        String salesName = tokenService.getCurrentUser(httpRequest);
        Page<SalesActivity> result = salesActivityService.search(
                activityId,
                salesName,
                customerName,
                contactPerson,
                isNewCustomer,
                startDate,
                endDate,
                startDateMain,
                endDateMain,
                page,
                size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchAdmin")
    public ResponseEntity<Page<SalesActivity>> searchAdmin(
            @RequestParam(value = "activityId", required = false) Long activityId,
            @RequestParam(value = "salesName", required = false) String salesName,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "contactPerson", required = false) String contactPerson,
            @RequestParam(value = "isNewCustomer", required = false) Boolean isNewCustomer,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "startDateMain", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDateMain,
            @RequestParam(value = "endDateMain", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDateMain,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<SalesActivity> result = salesActivityService.searchAdmin(
                activityId,
                salesName,
                customerName,
                contactPerson,
                isNewCustomer,
                startDate,
                endDate,
                startDateMain,
                endDateMain,
                page,
                size);
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

    @PostMapping("/checkIn")
    public ResponseEntity<?> checkIn(@RequestBody CheckInRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            salesActivityService.checkIn(request.getActivityId(), request.getCheckInLat(), request.getCheckInLng(),
                    username);
            return ResponseEntity.ok("เช็คอินสำเร็จ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    public static class CheckInRequest {
        private Long activityId;
        private java.math.BigDecimal checkInLat;
        private java.math.BigDecimal checkInLng;

        public Long getActivityId() {
            return activityId;
        }

        public void setActivityId(Long activityId) {
            this.activityId = activityId;
        }

        public java.math.BigDecimal getCheckInLat() {
            return checkInLat;
        }

        public void setCheckInLat(java.math.BigDecimal checkInLat) {
            this.checkInLat = checkInLat;
        }

        public java.math.BigDecimal getCheckInLng() {
            return checkInLng;
        }

        public void setCheckInLng(java.math.BigDecimal checkInLng) {
            this.checkInLng = checkInLng;
        }
    }

    @GetMapping("/summaryReport")
    public ResponseEntity<java.util.List<com.boxcorner.boxcorner.dto.SalesSummaryDTO>> summaryReport(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesActivityService.getSummaryReport(startDate, endDate));
    }
}
