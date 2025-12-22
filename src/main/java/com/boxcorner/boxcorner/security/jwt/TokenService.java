package com.boxcorner.boxcorner.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TokenService {
    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    @Autowired
    private JwtUtils jwtUtils; // เรียกใช้ Utility สำหรับแกะ Token

    public String getCurrentUser(HttpServletRequest request) {
        try {
            String headerAuth = request.getHeader("Authorization");

            if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
                String token = headerAuth.substring(7);
                
                // ตรวจสอบความถูกต้องของ Token ก่อน (เช็ค Signature, Expire)
                if (jwtUtils.validateToken(token)) {
                    // ดึงชื่อ User (Subject) ออกมาจาก Token
                    return jwtUtils.getUsernameFromToken(token);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        return "system"; // กรณีไม่เจอ Token หรือ Token ไม่ถูกต้อง ให้คืนค่า Default
    }
}