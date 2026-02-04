package com.boxcorner.boxcorner.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.service.ApiService;
import com.boxcorner.boxcorner.service.PapApiSoService;

@RestController
@RequestMapping("/api/pap")
public class PapController {
    
    @Autowired
    private ApiService apiService;

    @Autowired
    private PapApiSoService papApiSoService;

    @GetMapping("/getJo")
    public Map<String, Object> pap(@RequestParam(value = "oid", required = true) String orderId) {
        return apiService.getOrderData(orderId);
    }

    @GetMapping("/getSamplePap")
    public Map<String, Object> getSamplePap(@RequestParam(value = "oid", required = true) String orderId) {
        return papApiSoService.getSamplePAP(orderId);
    }
}
