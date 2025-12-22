package com.boxcorner.boxcorner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.dto.MenuResponse;
import com.boxcorner.boxcorner.repository.MenuRepository;
import com.boxcorner.boxcorner.security.jwt.TokenService;
import com.boxcorner.boxcorner.service.MenuService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MenuService menuService;

    @Autowired
    private TokenService tokenService;

    @GetMapping("/getmenu")
    public List<MenuResponse> getMenu(HttpServletRequest request) {
        String currentUser = tokenService.getCurrentUser(request);
        List<MenuResponse> flatMenus = menuRepository.findMenusByUsername(currentUser);

        return menuService.buildHierarchy(flatMenus);
    }

}
