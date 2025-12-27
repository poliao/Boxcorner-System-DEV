package com.boxcorner.boxcorner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.dto.OptionDTO;
import com.boxcorner.boxcorner.service.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserDetailsServiceImpl userService;

    @GetMapping("/planning")
    public List<OptionDTO> getPlanningOperators() {
        return userService.getPlanningOperators();
    }
}
