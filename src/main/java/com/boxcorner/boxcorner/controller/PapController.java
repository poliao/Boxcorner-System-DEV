package com.boxcorner.boxcorner.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boxcorner.boxcorner.entity.PapProductionOrder;
import com.boxcorner.boxcorner.service.ApiService;
import com.boxcorner.boxcorner.service.PapApiSoService;
import com.boxcorner.boxcorner.service.PapHtmlParserService;
import com.boxcorner.boxcorner.service.PapProductionOrderService;

@RestController
@RequestMapping("/api/pap")
public class PapController {

    @Autowired
    private ApiService apiService;

    @Autowired
    private PapApiSoService papApiSoService;

    @Autowired
    private PapHtmlParserService papHtmlParserService;

    @Autowired
    private PapProductionOrderService papProductionOrderService;

    @GetMapping("/getJo")
    public Map<String, Object> pap(@RequestParam(value = "oid", required = true) String orderId) {
        return apiService.getOrderData(orderId);
    }

    @GetMapping("/getSamplePap")
    public Map<String, Object> getSamplePap(@RequestParam(value = "oid", required = true) String orderId) {
        return papApiSoService.getSamplePAP(orderId);
    }

    @GetMapping("/getJob")
    public List<Map<String, Object>> getOrderDataJob(@RequestParam(value = "oid", required = true) String orderId) {
        List<Map<String, Object>> dataList = papHtmlParserService.getOrderDataJob(orderId);
        if (dataList != null && !dataList.isEmpty()) {
            for (Map<String, Object> data : dataList) {
                papProductionOrderService.saveFromMap(data);
            }
        }
        return dataList;
    }

    @PostMapping("/saveJob")
    public PapProductionOrder saveJob(@RequestBody Map<String, Object> data) {
        return papProductionOrderService.saveFromMap(data);
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getPapOrderById(@RequestParam(value = "id") Long id) {
        try {
            return ResponseEntity.ok(papProductionOrderService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
