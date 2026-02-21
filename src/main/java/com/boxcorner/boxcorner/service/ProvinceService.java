package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.Province;
import com.boxcorner.boxcorner.repository.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProvinceService {

    @Autowired
    private ProvinceRepository provinceRepository;

    public List<Province> searchProvinces(String search) {
        if (search == null || search.trim().isEmpty()) {
            return provinceRepository.findAll(PageRequest.of(0, 10)).getContent();
        }
        return provinceRepository.searchProvinces(search.trim(), PageRequest.of(0, 10));
    }
}
