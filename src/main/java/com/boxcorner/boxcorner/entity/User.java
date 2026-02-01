package com.boxcorner.boxcorner.entity; // เปลี่ยนตาม package ของคุณ

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.Data;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
@Data
public class User extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String role; 
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public boolean isAccountNonExpired() { return true; } // ไม่หมดอายุ

    @Override
    public boolean isAccountNonLocked() { return true; } // ไม่โดนล็อค

    @Override
    public boolean isCredentialsNonExpired() { return true; } // รหัสไม่หมดอายุ

    @Override
    public boolean isEnabled() { return true; } // เปิดใช้งาน
}