package com.boxcorner.boxcorner.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.FoodOrderItem;
import com.boxcorner.boxcorner.entity.FoodOrderSession;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.FoodOrderService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/food-order")
@RequiredArgsConstructor
public class FoodOrderController {

    private final FoodOrderService foodOrderService;
    private final TokenService tokenService;

    @GetMapping("/active")
    public Map<String, Object> getActive(HttpServletRequest request) {
        return foodOrderService.getActive(tokenService.getCurrentUser(request));
    }

    @PostMapping("/session")
    public FoodOrderSession openSession(@RequestBody Map<String, String> body, HttpServletRequest request) {
        return foodOrderService.openSession(tokenService.getCurrentUser(request), body.get("restaurantName"));
    }

    @PostMapping("/session/{id}/send")
    public FoodOrderSession sendSession(@PathVariable Long id, HttpServletRequest request) {
        return foodOrderService.sendSession(tokenService.getCurrentUser(request), id);
    }

    @PostMapping("/items")
    public FoodOrderItem addItem(@RequestBody FoodOrderItem item, HttpServletRequest request) {
        return foodOrderService.addItem(tokenService.getCurrentUser(request), item);
    }

    @PutMapping("/items/{id}")
    public FoodOrderItem updateItem(@PathVariable Long id, @RequestBody FoodOrderItem item, HttpServletRequest request) {
        return foodOrderService.updateItem(tokenService.getCurrentUser(request), id, item);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id, HttpServletRequest request) {
        foodOrderService.deleteItem(tokenService.getCurrentUser(request), id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(Map.of("message", ex.getMessage()));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(409).body(Map.of("message", ex.getMessage()));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }
}
