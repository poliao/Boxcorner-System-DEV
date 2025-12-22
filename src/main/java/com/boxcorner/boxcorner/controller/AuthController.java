package com.boxcorner.boxcorner.controller;

import java.util.Collections;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.boxcorner.boxcorner.dto.LoginRequest;
import com.boxcorner.boxcorner.dto.RegisterRequest;
import com.boxcorner.boxcorner.entity.User;
import com.boxcorner.boxcorner.repository.UserRepository;
import com.boxcorner.boxcorner.security.jwt.JwtUtils;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), 
                    loginRequest.getPassword()
                )
            );

            String token = jwtUtils.generateToken(loginRequest.getUsername());
            
            return ResponseEntity.ok(Collections.singletonMap("token", token));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        User newUser = new User();
        newUser.setUsername(request.getUsername());

        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        
        newUser.setRole("ROLE_USER");
    
        userRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully!");
    }
}