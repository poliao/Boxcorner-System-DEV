package com.boxcorner.boxcorner.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;

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
                
                if (jwtUtils.validateToken(token)) {
                    return jwtUtils.getUsernameFromToken(token);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        return "system"; // กรณีไม่เจอ Token หรือ Token ไม่ถูกต้อง ให้คืนค่า Default
    }

    public Long getIDUser(HttpServletRequest request) {
        try {
            String headerAuth = request.getHeader("Authorization");

            if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
                String token = headerAuth.substring(7);
                
                if (jwtUtils.validateToken(token)) {
                    return jwtUtils.getUserIdFromToken(token);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        return null;
    }
}