package com.boxcorner.boxcorner.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.boxcorner.boxcorner.entity.dto.OptionDTO;
import com.boxcorner.boxcorner.service.UserQcService;

@RestController
@RequestMapping("/api/userQc")
public class UserQcController {

    @Autowired
    private UserQcService userQcService;

    @GetMapping("/getUserQc")
    public List<OptionDTO> getUserQc(@RequestParam("department") String department) {
        return userQcService.getUserQc(department);
    }
    
}
