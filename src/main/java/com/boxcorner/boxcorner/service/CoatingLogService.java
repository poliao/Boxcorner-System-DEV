package com.boxcorner.boxcorner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.CoatingLog;
import com.boxcorner.boxcorner.repository.CoatingLogRepository;

@Service
public class CoatingLogService {

    @Autowired
    private CoatingLogRepository repository;

    public CoatingLog save(CoatingLog coatingLog, String username) {
        if (coatingLog.getTechnicianName() == null || coatingLog.getTechnicianName().isEmpty()) {
            coatingLog.setTechnicianName(username);
        }
        return repository.save(coatingLog);
    }

    public Page<CoatingLog> getAll(int page, int size, String id, String joId, String technicianName) {
        if ((id == null || id.trim().isEmpty()) &&
                (joId == null || joId.trim().isEmpty()) &&
                (technicianName == null || technicianName.trim().isEmpty())) {
            return repository.findAll(PageRequest.of(page, size));
        }
        return repository.findByFilters(id, joId, technicianName, PageRequest.of(page, size));
    }

    public CoatingLog getById(Integer id) {
        if (id == null)
            return null;
        return repository.findById(id).orElse(null);
    }
}
