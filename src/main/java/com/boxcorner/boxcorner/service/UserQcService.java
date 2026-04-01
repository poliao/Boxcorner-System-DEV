package com.boxcorner.boxcorner.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.dto.OptionDTO;
import com.boxcorner.boxcorner.repository.UserQcRepository;

@Service
public class UserQcService {

    @Autowired
    private UserQcRepository userQcRepository;

    public List<OptionDTO> getUserQc(String department) {
        if (department != null && department != "") {
            return userQcRepository.getNameQc(department);
        } else {
            return userQcRepository.getAllName();
        }
    }
}
