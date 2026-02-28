package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.PrintLogQa;
import com.boxcorner.boxcorner.repository.PrintLogQaRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrintLogQaService {

    private final PrintLogQaRepository printLogQaRepository;

    @Transactional
    public PrintLogQa save(@NonNull PrintLogQa logQs) {
        return printLogQaRepository.save(logQs);
    }

    @Transactional(readOnly = true)
    public List<PrintLogQa> findByJobId(Long jobId) {
        return printLogQaRepository.findByJobIdOrderByCreatedAtDesc(jobId);
    }
}
