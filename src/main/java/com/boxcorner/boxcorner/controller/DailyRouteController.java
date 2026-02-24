package com.boxcorner.boxcorner.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.DailyRoute;
import com.boxcorner.boxcorner.entity.User;
import com.boxcorner.boxcorner.repository.DailyRouteRepository;
import com.boxcorner.boxcorner.repository.UserRepository;

@RestController
@RequestMapping("/api/dailyRoutes")
public class DailyRouteController {

    @Autowired
    private DailyRouteRepository dailyRouteRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<?> startWork(@RequestBody StartWorkRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้"));

            LocalDate today = LocalDate.now(ZoneId.of("Asia/Bangkok"));
            
            // ตรวจสอบว่ามีการเริ่มงานวันนี้แล้วหรือไม่
            boolean exists = dailyRouteRepository.existsByEmployeeIdAndWorkDate(user.getId(), today);
            if (exists) {
                return ResponseEntity.badRequest().body("คุณได้เริ่มงานวันนี้แล้ว");
            }

            DailyRoute dailyRoute = DailyRoute.builder()
                    .employeeId(user.getId())
                    .workDate(today)
                    .startTime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")))
                    .startLat(request.getStartLat())
                    .startLng(request.getStartLng())
                    .build();

            dailyRouteRepository.save(dailyRoute);
            return ResponseEntity.ok(dailyRoute);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/end")
    public ResponseEntity<?> endWork(@RequestBody EndWorkRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้"));

            LocalDate today = LocalDate.now(ZoneId.of("Asia/Bangkok"));
            
            DailyRoute dailyRoute = dailyRouteRepository.findByEmployeeIdAndWorkDate(user.getId(), today)
                    .orElseThrow(() -> new RuntimeException("คุณยังไม่ได้เริ่มงานวันน้"));

            if (dailyRoute.getEndTime() != null) {
                return ResponseEntity.badRequest().body("คุณได้เลิกงานวันนี้แล้ว");
            }

            dailyRoute.setEndTime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")));
            dailyRoute.setEndLat(request.getEndLat());
            dailyRoute.setEndLng(request.getEndLng());

            dailyRouteRepository.save(dailyRoute);
            return ResponseEntity.ok(dailyRoute);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class StartWorkRequest {
        private BigDecimal startLat;
        private BigDecimal startLng;

        public BigDecimal getStartLat() {
            return startLat;
        }

        public void setStartLat(BigDecimal startLat) {
            this.startLat = startLat;
        }

        public BigDecimal getStartLng() {
            return startLng;
        }

        public void setStartLng(BigDecimal startLng) {
            this.startLng = startLng;
        }
    }

    public static class EndWorkRequest {
        private BigDecimal endLat;
        private BigDecimal endLng;

        public BigDecimal getEndLat() {
            return endLat;
        }

        public void setEndLat(BigDecimal endLat) {
            this.endLat = endLat;
        }

        public BigDecimal getEndLng() {
            return endLng;
        }

        public void setEndLng(BigDecimal endLng) {
            this.endLng = endLng;
        }
    }
}
