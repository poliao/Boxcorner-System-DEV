package com.boxcorner.boxcorner.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.BaseEntity.JobStatus;
import com.boxcorner.boxcorner.entity.BaseEntity.LogType;
import com.boxcorner.boxcorner.entity.BaseEntity.PrintSide;
import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.entity.PrintLog;
import com.boxcorner.boxcorner.entity.Printer;
import com.boxcorner.boxcorner.entity.dto.CalibrateRequest;
import com.boxcorner.boxcorner.entity.dto.StartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.StopPrintRequest;
import com.boxcorner.boxcorner.repository.PrintJobRepository;
import com.boxcorner.boxcorner.repository.PrintLogRepository;
import com.boxcorner.boxcorner.repository.PrinterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrintingService {

    private final PrintLogRepository printLogRepository;
    private final PrintJobRepository jobRepository;
    private final PrinterRepository printerRepository;

    // =========================================================================
    // 1. ACTION: START (เริ่มงาน / พิมพ์ต่อ / พิมพ์ซ่อม)
    // =========================================================================
    @Transactional
    public PrintLog startPrinting(StartPrintRequest req, String operatorName) {
        // 1. Validate: ตรวจสอบว่า Job และ Printer มีอยู่จริง
        PrintJob job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new RuntimeException("Job ID not found: " + req.getJobId()));

        Printer printer = printerRepository.findById(req.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer ID not found: " + req.getPrinterId()));

        Optional<PrintLog> activeLog = printLogRepository.findByPrinterIdAndEndedAtIsNull(printer.getId());
        if (activeLog.isPresent()) {
            throw new RuntimeException(
                    "เครื่องนี้มีงานค้างอยู่ (ลำดับงานที่: " + activeLog.get().getJob().getId() + ") กรุณาจบงานก่อน");
        }

        // 3. Create New Log
        PrintLog log = PrintLog.builder()
                .job(job)
                .printer(printer)
                .printSide(PrintSide.valueOf(req.getPrintSide())) // FRONT / BACK
                .logType(LogType.valueOf(req.getLogType())) // NORMAL / REPRINT
                .startedAt(LocalDateTime.now())
                .meterColorStart(req.getMeterColorStart())
                .meterBwStart(req.getMeterBwStart())
                .meterSpecialStart(req.getMeterSpecialStart())
                .paperReqStart(req.getPaperReqStart())
                .operatorName(operatorName)
                .build();

        // 4. Update Job Status -> IN_PROGRESS
        if (JobStatus.PENDING.equals(job.getJobStatus()) || JobStatus.PAUSED.equals(job.getJobStatus())) {
            job.setJobStatus(JobStatus.IN_PROGRESS);
            jobRepository.save(job);
        } else if (JobStatus.WAITPAGE2.equals(job.getJobStatus())
                || JobStatus.PAUSED_PAGE2.equals(job.getJobStatus())) {
            job.setJobStatus(JobStatus.IN_PROGRESS_PAGE2);
            jobRepository.save(job);
        }

        return printLogRepository.save(log);
    }

    // =========================================================================
    // 2. ACTION: STOP (หยุดชั่วคราว / จบงาน)
    // =========================================================================
    @Transactional
    public PrintLog stopPrinting(StopPrintRequest req) {
        PrintLog log = printLogRepository.findById(req.getLogId())
                .orElseThrow(() -> new RuntimeException("Log ID not found: " + req.getLogId()));
        if (log.getEndedAt() != null) {
            throw new RuntimeException("Log นี้ถูกบันทึกจบไปแล้ว ไม่สามารถแก้ไขได้");
        }

        log.setEndedAt(LocalDateTime.now());
        log.setMeterColorEnd(req.getMeterColorEnd());
        log.setMeterBwEnd(req.getMeterBwEnd());
        log.setMeterSpecialEnd(req.getMeterSpecialEnd());
        log.setPaperReqEnd(req.getPaperReqEnd());
        log.setNote(req.getNote());

        // 3. Calculate Total Impressions (คำนวณยอดรวมทันทีที่จบ)
        // long total = calculateTotal(log);
        // log.setTotalImpressions((int) total);

        // 4. Handle Job Status based on Action (PAUSE vs FINISH)
        PrintJob job = log.getJob();

        if ("FINISH".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus(JobStatus.COMPLETED);
        } else if ("PAUSE".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus(JobStatus.PAUSED);
        } else if ("WAITPAGE2".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus(JobStatus.WAITPAGE2);
        } else if ("PAUSED_PAGE2".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus(JobStatus.PAUSED_PAGE2);
        } else if ("FINISH_PAGE2".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus(JobStatus.COMPLETED);
        }

        jobRepository.save(job);
        return printLogRepository.save(log);
    }

    public PrintLog getActiveLogByPrinter(Integer printerId) {
        return printLogRepository.findByPrinterIdAndEndedAtIsNull(printerId)
                .orElse(null); // ถ้าไม่มีส่ง null กลับไป
    }

    public PrintLog gePrintLog(Long LogId) {
        return printLogRepository.findById(LogId).orElse(null); // ถ้าไม่มีส่ง null กลับไป
    }

    public PrintLog saveCalibrate(CalibrateRequest request) {

        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found: " + request.getPrinterId()));

        PrintLog log = PrintLog.builder()
                .printer(printer)
                .printSide(PrintSide.valueOf((String) request.getPrintSide()))
                .logType(LogType.valueOf((String) request.getLogType()))
                .meterColorStart(((Number) request.getMeterColorStart()).longValue())
                .meterColorEnd(((Number) request.getMeterColorEnd()).longValue())
                .meterBwStart(((Number) request.getMeterBwStart()).longValue())
                .meterBwEnd(((Number) request.getMeterBwEnd()).longValue())
                .startedAt(LocalDateTime.now())
                .endedAt(LocalDateTime.now())
                .note(request.getNote())
                .build();

        return printLogRepository.save(log);
    }

    public java.util.List<PrintLog> getLogsByJobId(Long jobId) {
        return printLogRepository.findByJobIdOrderByStartedAtDesc(jobId);
    }

}