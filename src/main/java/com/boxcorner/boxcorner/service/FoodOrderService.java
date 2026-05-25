package com.boxcorner.boxcorner.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.boxcorner.boxcorner.entity.FoodOrderItem;
import com.boxcorner.boxcorner.entity.FoodOrderSession;
import com.boxcorner.boxcorner.entity.FoodOrderSession.FoodOrderStatus;
import com.boxcorner.boxcorner.repository.FoodOrderItemRepository;
import com.boxcorner.boxcorner.repository.FoodOrderSessionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodOrderService {

    public static final String ADMIN_USERNAME = "somporn";
    private static final String TOPIC = "/topic/food-order";

    private final FoodOrderSessionRepository sessionRepository;
    private final FoodOrderItemRepository itemRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Map<String, Object> getActive(String currentUser) {
        FoodOrderSession session = sessionRepository.findFirstByOrderByCreatedAtDesc().orElse(null);
        List<FoodOrderItem> items = session == null
                ? Collections.emptyList()
                : itemRepository.findBySessionIdOrderByCreatedAtAsc(session.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("session", session);
        result.put("items", items);
        result.put("currentUser", currentUser);
        result.put("canControl", ADMIN_USERNAME.equals(currentUser));
        return result;
    }

    public FoodOrderSession openSession(String currentUser, String restaurantName) {
        if (!ADMIN_USERNAME.equals(currentUser)) {
            throw new AccessDeniedException("เฉพาะ " + ADMIN_USERNAME + " เท่านั้นที่เปิดบิลได้");
        }
        if (restaurantName == null || restaurantName.trim().isEmpty()) {
            throw new IllegalArgumentException("กรุณากรอกชื่อร้านอาหาร");
        }
        sessionRepository.findFirstByStatusOrderByCreatedAtDesc(FoodOrderStatus.OPEN)
                .ifPresent(s -> {
                    throw new IllegalStateException("ยังมีบิลที่เปิดอยู่ กรุณาส่งให้ร้านค้าก่อน");
                });

        FoodOrderSession session = new FoodOrderSession();
        session.setRestaurantName(restaurantName.trim());
        session.setStatus(FoodOrderStatus.OPEN);
        session.setOpenedBy(currentUser);
        FoodOrderSession saved = sessionRepository.save(session);
        broadcastRefresh();
        return saved;
    }

    public FoodOrderSession sendSession(String currentUser, Long sessionId) {
        if (!ADMIN_USERNAME.equals(currentUser)) {
            throw new AccessDeniedException("เฉพาะ " + ADMIN_USERNAME + " เท่านั้นที่ส่งบิลได้");
        }
        FoodOrderSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบบิล"));
        if (session.getStatus() != FoodOrderStatus.OPEN) {
            throw new IllegalStateException("บิลนี้ถูกส่งไปแล้ว");
        }
        session.setStatus(FoodOrderStatus.SENT);
        FoodOrderSession saved = sessionRepository.save(session);
        broadcastRefresh();
        return saved;
    }

    public FoodOrderItem addItem(String currentUser, FoodOrderItem payload) {
        FoodOrderSession session = sessionRepository.findById(payload.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบบิล"));
        if (session.getStatus() != FoodOrderStatus.OPEN) {
            throw new IllegalStateException("บิลนี้ปิดแล้ว ไม่สามารถเพิ่มได้");
        }
        validateItem(payload);

        FoodOrderItem item = new FoodOrderItem();
        item.setSessionId(session.getId());
        item.setUsername(currentUser);
        item.setDisplayName(payload.getDisplayName().trim());
        item.setMenuName(payload.getMenuName().trim());
        item.setQuantity(payload.getQuantity());
        FoodOrderItem saved = itemRepository.save(item);
        broadcastRefresh();
        return saved;
    }

    public FoodOrderItem updateItem(String currentUser, Long itemId, FoodOrderItem payload) {
        FoodOrderItem existing = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบรายการ"));
        if (!existing.getUsername().equals(currentUser)) {
            throw new AccessDeniedException("แก้ไขได้เฉพาะรายการของตัวเอง");
        }
        FoodOrderSession session = sessionRepository.findById(existing.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบบิล"));
        if (session.getStatus() != FoodOrderStatus.OPEN) {
            throw new IllegalStateException("บิลนี้ปิดแล้ว ไม่สามารถแก้ไขได้");
        }
        validateItem(payload);

        existing.setDisplayName(payload.getDisplayName().trim());
        existing.setMenuName(payload.getMenuName().trim());
        existing.setQuantity(payload.getQuantity());
        FoodOrderItem saved = itemRepository.save(existing);
        broadcastRefresh();
        return saved;
    }

    public void deleteItem(String currentUser, Long itemId) {
        FoodOrderItem existing = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบรายการ"));
        if (!existing.getUsername().equals(currentUser)) {
            throw new AccessDeniedException("ลบได้เฉพาะรายการของตัวเอง");
        }
        FoodOrderSession session = sessionRepository.findById(existing.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบบิล"));
        if (session.getStatus() != FoodOrderStatus.OPEN) {
            throw new IllegalStateException("บิลนี้ปิดแล้ว ไม่สามารถลบได้");
        }
        itemRepository.deleteById(itemId);
        broadcastRefresh();
    }

    private void validateItem(FoodOrderItem item) {
        if (item.getDisplayName() == null || item.getDisplayName().trim().isEmpty()) {
            throw new IllegalArgumentException("กรุณากรอกชื่อ");
        }
        if (item.getMenuName() == null || item.getMenuName().trim().isEmpty()) {
            throw new IllegalArgumentException("กรุณากรอกเมนู");
        }
        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new IllegalArgumentException("จำนวนกล่องต้องมากกว่า 0");
        }
    }

    private void broadcastRefresh() {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "refresh");
        messagingTemplate.convertAndSend(TOPIC, message);
    }
}
