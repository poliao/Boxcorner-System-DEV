package com.boxcorner.boxcorner.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.boxcorner.boxcorner.entity.ProductionOrderPart;
import com.boxcorner.boxcorner.repository.ProductionOrderPartRepository;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/production-parts")
public class ProductionOrderPartController {

    @Autowired
    private ProductionOrderPartRepository partRepository;

    @GetMapping("/getByOrderId")
    public List<ProductionOrderPart> getByOrderId(@RequestParam("orderId") Integer orderId) {
        return partRepository.findByProductionOrderId(orderId);
    }

    @PostMapping("/saveAll")
    @Transactional
    public List<ProductionOrderPart> saveAll(@RequestParam("orderId") Integer orderId,
            @RequestBody List<ProductionOrderPart> parts) {
        partRepository.deleteByProductionOrderId(orderId);
        for (ProductionOrderPart part : parts) {
            part.setProductionOrderId(orderId);
            part.setId(null);
        }
        return partRepository.saveAll(parts);
    }
}
