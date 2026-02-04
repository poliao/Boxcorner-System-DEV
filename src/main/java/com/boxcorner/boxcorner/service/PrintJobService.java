package com.boxcorner.boxcorner.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.repository.PrintJobRepository;

import jakarta.transaction.Transactional;

@Service
public class PrintJobService {

    @Autowired
    private PrintJobRepository repository;

    public List<PrintJob> getAllJobs() {
        return repository.findAll();
    }

    public PrintJob getJobById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลคิวงาน ID: " + id));
    }

    public PrintJob save(PrintJob printJob) {
        if (printJob.getId() != null) {
            PrintJob existing = repository.findById(printJob.getId()).orElse(null);

            if (printJob.getRowVersion() != null && !existing.getRowVersion().equals(printJob.getRowVersion())) { throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่" );}

            existing.setCreatedAt(printJob.getCreatedAt());
            existing.setJobId(printJob.getJobId());
            existing.setDeliveryDate(printJob.getDeliveryDate());
            existing.setJobId(printJob.getJobId());
            existing.setCustomerJobName(printJob.getCustomerJobName());
            existing.setJobStatus(printJob.getJobStatus());
            existing.setTotalPrintSheets(printJob.getTotalPrintSheets());
            existing.setProductionQty(printJob.getProductionQty());
            existing.setPrinterName(printJob.getPrinterName());
            existing.setSetupWaste(printJob.getSetupWaste());
            existing.setSampleRefNo(printJob.getSampleRefNo());
            
            return repository.save(existing);
        }
        return repository.save(printJob);
    }

    @Transactional
    public void deleteJob(Long id) {
        repository.deleteById(id);
    }

}
