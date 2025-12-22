package com.boxcorner.boxcorner.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("test/api")
public class TestController {
    
    @PostMapping("/login")
    public String login() {
        return "login";
    }
}
