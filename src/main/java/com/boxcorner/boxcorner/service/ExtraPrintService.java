package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.ExtraPrint;
import com.boxcorner.boxcorner.repository.ExtraPrintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExtraPrintService {

    @Autowired
    private ExtraPrintRepository extraPrintRepository;

    public Optional<ExtraPrint> findById(Long id) {
        return extraPrintRepository.findById(id);
    }

    public List<ExtraPrint> findByPrintJobId(Long printJobId) {
        return extraPrintRepository.findByPrintJobIdOrderByCreatedAtDesc(printJobId);
    }

    public Map<Long, List<ExtraPrint>> getBatchExtraPrints(List<Long> printJobIds) {
        List<ExtraPrint> extraPrints = extraPrintRepository.findByPrintJobIdIn(printJobIds);
        return extraPrints.stream().collect(Collectors.groupingBy(ExtraPrint::getPrintJobId));
    }

    @Transactional
    public ExtraPrint save(ExtraPrint extraPrint) {
        if (extraPrint.getId() != null) {
            ExtraPrint existing = extraPrintRepository.findById(extraPrint.getId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสำหรับการอัปเดต ID: " + extraPrint.getId()));

            if (extraPrint.getRowVersion() != null && !existing.getRowVersion().equals(extraPrint.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            existing.setPrintJobId(extraPrint.getPrintJobId());
            existing.setAdditionalQty(extraPrint.getAdditionalQty());
            existing.setReason(extraPrint.getReason());
            existing.setStatus(extraPrint.getStatus());
            existing.setRequestedBy(extraPrint.getRequestedBy());

            return extraPrintRepository.save(existing);
        } else {
            return extraPrintRepository.save(extraPrint);
        }
    }

    public void deleteById(Long id) {
        extraPrintRepository.deleteById(id);
    }
}
