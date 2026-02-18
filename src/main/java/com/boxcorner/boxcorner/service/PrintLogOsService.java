package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.PrintLogOs;
import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.repository.PrintLogOsRepository;
import com.boxcorner.boxcorner.repository.PrintJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrintLogOsService {

    private final PrintLogOsRepository printLogOsRepository;
    private final PrintJobRepository printJobRepository;

    @Transactional
    public PrintLogOs save(PrintLogOs printLogOs) {
        return printLogOsRepository.save(printLogOs);
    }

    @Transactional(readOnly = true)
    public List<PrintLogOs> findByJobId(Long jobId) {
        return printLogOsRepository.findByJobId(jobId);
    }

    @Transactional(readOnly = true)
    public PrintLogOs findById(Long id) {
        return printLogOsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PrintLogOs not found with id: " + id));
    }

    @Transactional
    public PrintLogOs createFromChecklist(Long jobId, PrintLogOs checklistData) {
        // Verify job exists
        printJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("PrintJob not found with id: " + jobId));
        
        checklistData.setJobId(jobId);
        return printLogOsRepository.save(checklistData);
    }
}
