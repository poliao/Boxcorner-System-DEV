package com.boxcorner.boxcorner.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boxcorner.boxcorner.entity.BaseEntity.LogType;
import com.boxcorner.boxcorner.entity.BaseEntity.PrintSide;
import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.entity.PrintLog;
import com.boxcorner.boxcorner.entity.Printer;
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
    public PrintLog startPrinting(StartPrintRequest req) {
        // 1. Validate: ตรวจสอบว่า Job และ Printer มีอยู่จริง
        PrintJob job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new RuntimeException("Job ID not found: " + req.getJobId()));
        
        Printer printer = printerRepository.findById(req.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer ID not found: " + req.getPrinterId()));

        // 2. Security Check: (Optional) เช็คว่าเครื่องนี้มีงานค้างอยู่ไหม?
        // ถ้ามีงานค้าง ห้ามเริ่มงานใหม่ซ้อนกัน
        Optional<PrintLog> activeLog = printLogRepository.findByPrinterIdAndEndedAtIsNull(printer.getId());
        if (activeLog.isPresent()) {
             throw new RuntimeException("เครื่องนี้มีงานค้างอยู่ (ลำดับงานที่: " + activeLog.get().getJob().getId() + ") กรุณาจบงานก่อน");
        }

        // 3. Create New Log
        PrintLog log = PrintLog.builder()
                .job(job)
                .printer(printer)
                .printSide(PrintSide.valueOf(req.getPrintSide())) // FRONT / BACK
                .logType(LogType.valueOf(req.getLogType()))       // NORMAL / REPRINT
                .startedAt(LocalDateTime.now())
                
                // Meter Start
                .meterColorStart(req.getMeterColorStart())
                .meterBwStart(req.getMeterBwStart())
                .meterSpecialStart(req.getMeterSpecialStart()) // Canon จะเป็น null ก็ไม่เป็นไร
                
                // Paper
                .paperReqStart(req.getPaperReqStart())
                .build();

        // 4. Update Job Status -> IN_PROGRESS
        if ("PENDING".equals(job.getJobStatus()) || "PAUSED".equals(job.getJobStatus())) {
            job.setJobStatus("IN_PROGRESS");
            jobRepository.save(job);
        }else if ("WAITPAGE2".equals(job.getJobStatus())) {
            job.setJobStatus("IN_PROGRESS_PAGE2");
            jobRepository.save(job);
        }

        return printLogRepository.save(log);
    }

    // =========================================================================
    // 2. ACTION: STOP (หยุดชั่วคราว / จบงาน)
    // =========================================================================
    @Transactional
    public PrintLog stopPrinting(StopPrintRequest req) {
        PrintLog log = printLogRepository.findById(req.getLogId()).orElseThrow(() -> new RuntimeException("Log ID not found: " + req.getLogId()));
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
            job.setJobStatus("COMPLETED");
        } else if ("PAUSE".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus("PAUSED");
        } else if ("WAITPAGE2".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus("WAITPAGE2");
        } else if ("PAUSED_PAGE2".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus("PAUSED_PAGE2");
        } else if ("COMPLETED_PAGE2".equalsIgnoreCase(req.getAction())) {
            job.setJobStatus("COMPLETED_PAGE2");
        }
        
        jobRepository.save(job);
        return printLogRepository.save(log);
    }

    // =========================================================================
    // 3. UTILITY: Check Active Log (สำหรับหน้าจอ Restore State)
    // =========================================================================
    public PrintLog getActiveLogByPrinter(Integer printerId) {
        // ค้นหา Log ที่ endedAt เป็น NULL (ยังไม่จบ)
        return printLogRepository.findByPrinterIdAndEndedAtIsNull(printerId)
                .orElse(null); // ถ้าไม่มีส่ง null กลับไป
    }

    public PrintLog gePrintLog(Long LogId) {
        return printLogRepository.findById(LogId).orElse(null); // ถ้าไม่มีส่ง null กลับไป
    }
    
    // =========================================================================
    // 4. PRIVATE HELPER: Calculation Logic
    // =========================================================================
    // private long calculateTotal(PrintLog log) {
    //     long color = (log.getMeterColorEnd() != null && log.getMeterColorStart() != null) 
    //                  ? log.getMeterColorEnd() - log.getMeterColorStart() : 0;
                     
    //     long bw = (log.getMeterBwEnd() != null && log.getMeterBwStart() != null) 
    //               ? log.getMeterBwEnd() - log.getMeterBwStart() : 0;
                  
    //     long special = (log.getMeterSpecialEnd() != null && log.getMeterSpecialStart() != null) 
    //                    ? log.getMeterSpecialEnd() - log.getMeterSpecialStart() : 0;
                       
    //     return color + bw + special;
    // }
}