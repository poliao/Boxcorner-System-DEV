package com.boxcorner.boxcorner.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public Optional<PrintJob> getJobById(Long id) {
        return repository.findById(id);
    }

    public PrintJob save(PrintJob printJob) {
        System.out.println("Saving PrintJob: " + printJob);
        if (printJob.getId() != null) {
            PrintJob existing = repository.findById(printJob.getId()).orElse(null);

            if (printJob.getRowVersion() != null && !existing.getRowVersion().equals(printJob.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            existing.setJobId(printJob.getJobId());
            existing.setDeliveryDate(printJob.getDeliveryDate());
            existing.setDeliveryTime(printJob.getDeliveryTime());
            existing.setCustomerJobName(printJob.getCustomerJobName());
            existing.setJobStatus(printJob.getJobStatus());
            existing.setTotalPrintSheets(printJob.getTotalPrintSheets());
            existing.setProductionQty(printJob.getProductionQty());
            existing.setPrinterName(printJob.getPrinterName());
            existing.setSetupWaste(printJob.getSetupWaste());
            existing.setSampleRefNo(printJob.getSampleRefNo());
            existing.setIssample(printJob.getIssample());
            existing.setJobType(printJob.getJobType());
            existing.setPrintType(printJob.getPrintType());
            existing.setPaperType(printJob.getPaperType());
            existing.setDiecuttingType(printJob.getDiecuttingType());
            existing.setCoatType(printJob.getCoatType());
            existing.setSystemPrint(printJob.getSystemPrint());
            existing.setColorPrint(printJob.getColorPrint());
            existing.setPaperGram(printJob.getPaperGram());
            existing.setPrintingRecordId(printJob.getPrintingRecordId());
            existing.setSampleId(printJob.getSampleId());
            existing.setProductionJobId(printJob.getProductionJobId());
            existing.setPrint2Page(printJob.getPrint2Page());
            existing.setTypeJob(printJob.getTypeJob());
            existing.setProductionOrderId(printJob.getProductionOrderId());
            existing.setDecisionAuthority(printJob.getDecisionAuthority());
            existing.setDecisionAuthorityRemarks(printJob.getDecisionAuthorityRemarks());
            existing.setPapOrderId(printJob.getPapOrderId());
            existing.setSampleJobType(printJob.getSampleJobType());
            existing.setSamplePrintingSystem(printJob.getSamplePrintingSystem());
            existing.setSamplePrintingStyle(printJob.getSamplePrintingStyle());
            existing.setSamplePrintingColor(printJob.getSamplePrintingColor());
            existing.setSamplePaperSize(printJob.getSamplePaperSize());
            existing.setSamplePaperGrammage(printJob.getSamplePaperGrammage());
            existing.setSampleCoatingStyle(printJob.getSampleCoatingStyle());
            existing.setSampleDiecutStyle(printJob.getSampleDiecutStyle());
            existing.setSampleSpecialInstructions(printJob.getSampleSpecialInstructions());
            existing.setSampleDeliveryTimestamp(printJob.getSampleDeliveryTimestamp());
            existing.setPrintRound(printJob.getPrintRound());
            existing.setPrintRoundPage2(printJob.getPrintRoundPage2());
            existing.setCurrentRound(printJob.getCurrentRound());
            existing.setReorderFromJoId(printJob.getReorderFromJoId());
            return repository.save(existing);
        }
        printJob.setJobStatus("รอพิมพ์");
        return repository.save(printJob);
    }

    @Transactional
    public void deleteJob(Long id) {
        repository.deleteById(id);
    }

    public Page<PrintJob> getAllDetail(Long id, String jobId, String customerJobName, String printerName,
            Date startDate, Date endDate, Boolean issample, String jobStatus, String meterCategory, int page,
            int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        Page<PrintJob> pageResult = repository.findByFiltersAll(id, jobId, customerJobName, printerName, startDate,
                endDate, issample,
                jobStatus, paging);

        List<String> sampleJobIds = pageResult.getContent().stream()
                .filter(job -> Boolean.TRUE.equals(job.getIssample()) && job.getJobId() != null
                        && !job.getJobId().isEmpty())
                .map(PrintJob::getJobId)
                .distinct()
                .toList();

        if (!sampleJobIds.isEmpty()) {
            List<String> realJobIds = repository.findRealJobIdsByJobIds(sampleJobIds);
            pageResult.getContent().forEach(job -> {
                if (Boolean.TRUE.equals(job.getIssample()) && job.getJobId() != null
                        && realJobIds.contains(job.getJobId())) {
                    job.setHasRealJob(true);
                }
            });
        }

        return pageResult;
    }

    public Page<PrintJob> findByFiltersOS(Long id, String jobId, String customerJobName, String printerName,
            String jobStatus, int page,
            int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByFiltersOS(id, jobId, customerJobName, printerName, jobStatus, paging);
    }

    public Page<PrintJob> findByFiltersODPrinter(Long id, String jobId, String customerJobName, String printerName,
            Date startDate, Date endDate, String jobStatus, int page, int size) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByFiltersODPrinter(id, jobId, customerJobName, printerName, startDate, endDate,
                jobStatus, paging);
    }

    public PrintJob findByProductionOrderId(Integer productionOrderId) {
        return repository.findByProductionOrderId(productionOrderId);
    }

    public PrintJob updateJobStatusOnly(Long id, String jobStatus) {
        PrintJob existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PrintJob not found: " + id));
        existing.setJobStatus(jobStatus);
        return repository.save(existing);
    }
}
