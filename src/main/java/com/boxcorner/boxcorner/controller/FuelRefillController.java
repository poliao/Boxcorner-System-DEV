package com.boxcorner.boxcorner.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.FuelRefill;
import com.boxcorner.boxcorner.entity.User;
import com.boxcorner.boxcorner.repository.FuelRefillRepository;
import com.boxcorner.boxcorner.repository.UserRepository;

@RestController
@RequestMapping("/api/fuelRefills")
public class FuelRefillController {

    @Autowired
    private FuelRefillRepository fuelRefillRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createFuelRefill(@RequestBody FuelRefillRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้"));

            FuelRefill fuelRefill = FuelRefill.builder()
                    .employeeId(user.getId())
                    .refillTime(LocalDateTime.now(ZoneId.of("Asia/Bangkok")))
                    .price(request.getPrice())
                    .odometer(request.getOdometer())
                    .build();

            fuelRefillRepository.save(fuelRefill);
            return ResponseEntity.ok("บันทึกการเติมน้ำมันสำเร็จ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class FuelRefillRequest {
        private BigDecimal price;
        private BigDecimal odometer;

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public BigDecimal getOdometer() {
            return odometer;
        }

        public void setOdometer(BigDecimal odometer) {
            this.odometer = odometer;
        }
    }
}
