package com.boxcorner.boxcorner.controller;

import com.boxcorner.boxcorner.entity.Province;
import com.boxcorner.boxcorner.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provinces")
@CrossOrigin(origins = "*")
public class ProvinceController {

    @Autowired
    private ProvinceService provinceService;

    @GetMapping("/search")
    public ResponseEntity<List<Province>> searchProvinces(@RequestParam(required = false, name = "search") String search) {
        List<Province> provinces = provinceService.searchProvinces(search);
        return ResponseEntity.ok(provinces);
    }
}
