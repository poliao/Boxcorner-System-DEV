package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.*;
import com.boxcorner.boxcorner.entity.dto.OdStartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.OdStopPrintRequest;
import com.boxcorner.boxcorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OdPrintingService {

    private final PrintLogRepository printLogRepository;
    private final PrintJobRepository jobRepository;
    private final PrinterRepository printerRepository;
    private final LotRepository lotRepository;
    private final OdCutPaperRepository odCutPaperRepository;
    private final OdCutPaperUsageLogRepository odCutPaperUsageLogRepository;
    private final StockLogService stockLogService;

    public boolean checkLotStock(Integer lotId, Double requiredSheets) {
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot ID not found: " + lotId));
        double currentBaseQty = lot.getBaseQty() != null ? lot.getBaseQty() : 0.0;
        return currentBaseQty >= requiredSheets;
    }

    public List<OdCutPaper> getAvailableCutPapers() {
        return odCutPaperRepository.findByStatusOrderByCreatedAtDesc(OdCutPaper.Status.AVAILABLE);
    }

    @Transactional
    public PrintLog startOdPrinting(OdStartPrintRequest req, String operatorName) {
        PrintJob job = null;
        if (req.getJobId() != null) {
            job = jobRepository.findById(req.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job ID not found: " + req.getJobId()));
        }

        Printer printer = printerRepository.findById(req.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer ID not found: " + req.getPrinterId()));

        Optional<PrintLog> activeLog = printLogRepository.findByPrinterIdAndEndedAtIsNull(printer.getId());
        if (activeLog.isPresent()) {
            throw new RuntimeException("เครื่องนี้มีงานค้างอยู่ หรือกดเริ่มงานซ้อนซ้ำ");
        }

        Long finalOdCutPaperId = null;

        // Process Paper Source
        if ("NEW_CUT".equalsIgnoreCase(req.getPaperSourceType())) {
            if (req.getLotId() == null || req.getLargeSheetsTaken() == null || req.getCutMultiplier() == null) {
                throw new RuntimeException("กรุณาระบุข้อมูลการเบิกกระดาษแผ่นใหญ่ให้ครบถ้วน");
            }
            Lot lot = lotRepository.findById(req.getLotId())
                    .orElseThrow(() -> new RuntimeException("Lot ID not found: " + req.getLotId()));

            double currentLotBaseQty = lot.getBaseQty() != null ? lot.getBaseQty() : 0.0;
            if (currentLotBaseQty < req.getLargeSheetsTaken()) {
                throw new RuntimeException("กระดาษใน Lot สต็อคไม่เพียงพอ");
            }

            // Deduct from Lot
            lot.setBaseQty(currentLotBaseQty - req.getLargeSheetsTaken());
            lotRepository.save(lot);

            // Log OUT Stock
            int smallSheetsCreated = (int) Math.round(req.getLargeSheetsTaken() * req.getCutMultiplier());
            StockLog stockLog = StockLog.builder()
                    .lotId(lot.getId())
                    .materialId(lot.getMaterial() != null ? lot.getMaterial().getId() : null)
                    .transactionType(StockLog.TransactionType.OUT)
                    .quantityMajor(java.math.BigDecimal.ZERO)
                    .quantityMinor(java.math.BigDecimal.valueOf(req.getLargeSheetsTaken()))
                    .totalSheets(smallSheetsCreated)
                    .referenceJobId(job != null ? job.getId() : null)
                    .operatorName(operatorName)
                    .note(String.format("เบิกกรีดแบ่งสำหรับกระดาษ OD (แบ่ง %d ส่วน)", req.getCutMultiplier()))
                    .build();
            stockLogService.logTransaction(stockLog);

            // Create OdCutPaper Pile
            OdCutPaper cutPaper = OdCutPaper.builder()
                    .lot(lot)
                    .material(lot.getMaterial())
                    .cutPiecesPerSheet(req.getCutMultiplier())
                    .largeSheetsTaken(req.getLargeSheetsTaken())
                    .totalSmallSheetsCreated(smallSheetsCreated)
                    .remainingSmallSheets(smallSheetsCreated)
                    .createdFromJob(job)
                    .operatorName(operatorName)
                    .status(OdCutPaper.Status.AVAILABLE)
                    .build();
            OdCutPaper savedCutPaper = odCutPaperRepository.save(cutPaper);
            finalOdCutPaperId = savedCutPaper.getId();

        } else if ("EXISTING_CUT".equalsIgnoreCase(req.getPaperSourceType())) {
            if (req.getOdCutPaperId() == null) {
                throw new RuntimeException("กรุณาระบุรหัสเศษกระดาษที่ต้องการใช้");
            }
            OdCutPaper cutPaper = odCutPaperRepository.findById(req.getOdCutPaperId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลเศษกระดาษ"));
            if (cutPaper.getStatus() == OdCutPaper.Status.DEPLETED || cutPaper.getRemainingSmallSheets() <= 0) {
                throw new RuntimeException("กระดาษกองนี่ถูกใช้จนหมดแล้ว");
            }
            finalOdCutPaperId = cutPaper.getId();
        } else if ("DIRECT_LOT".equalsIgnoreCase(req.getPaperSourceType())) {
            if (req.getLotId() == null) {
                throw new RuntimeException("กรุณาระบุ Lot กระดาษ");
            }
            // we do nothing special here for the Lot, we just save the lotId in the PrintLog
        }

        // Create PrintLog
        PrintLog log = PrintLog.builder()
                .job(job)
                .printer(printer)
                .printSide(BaseEntity.PrintSide.valueOf(req.getPrintSide()))
                .logType(BaseEntity.LogType.valueOf(req.getLogType()))
                .startedAt(LocalDateTime.now())
                .meterColorStart(req.getMeterColorStart())
                .meterBwStart(req.getMeterBwStart())
                .meterSpecialStart(req.getMeterSpecialStart())
                .operatorName(operatorName)
                .odCutPaperId(finalOdCutPaperId)
                .lotId("DIRECT_LOT".equalsIgnoreCase(req.getPaperSourceType()) ? req.getLotId() : null)
                .build();

        // Update Job Status
        if (job != null) {
            if ("รอพิมพ์".equals(job.getJobStatus()) || "หยุดชั่วคราว".equals(job.getJobStatus()) || "PENDING".equals(job.getJobStatus())) {
                job.setJobStatus("กำลังพิมพ์ด้านหน้า");
                jobRepository.save(job);
            } else if ("รอพิมพ์หน้า 2".equals(job.getJobStatus()) || "หยุดชั่วคราว (หน้า 2)".equals(job.getJobStatus()) || "WAITPAGE2".equals(job.getJobStatus()) || "PAUSED_PAGE2".equals(job.getJobStatus())) {
                job.setJobStatus("กำลังพิมพ์ด้านหลัง");
                jobRepository.save(job);
            }
        }

        return printLogRepository.save(log);
    }

    @Transactional
    public PrintLog stopOdPrinting(OdStopPrintRequest req, String operatorName) {
        PrintLog log = printLogRepository.findById(req.getLogId())
                .orElseThrow(() -> new RuntimeException("Log ID not found: " + req.getLogId()));
        if (log.getEndedAt() != null) {
            throw new RuntimeException("Log นี้จบไปแล้ว");
        }

        log.setEndedAt(LocalDateTime.now());
        log.setMeterColorEnd(req.getMeterColorEnd());
        log.setMeterBwEnd(req.getMeterBwEnd());
        log.setMeterSpecialEnd(req.getMeterSpecialEnd());
        log.setNote(req.getNote());
        log.setGoodQty(req.getGoodQty());
        log.setWasteQty(req.getWasteQty());

        int totalUsed = (req.getGoodQty() != null ? req.getGoodQty() : 0) + (req.getWasteQty() != null ? req.getWasteQty() : 0);
        log.setTotalSheetsUsed(totalUsed);

        // Deduct from details
        boolean isFinishing = "FINISH".equalsIgnoreCase(req.getAction()) || "FINISH_PAGE2".equalsIgnoreCase(req.getAction()) || "WAITPAGE2".equalsIgnoreCase(req.getAction());
        if (isFinishing && log.getOdCutPaperId() != null && totalUsed > 0) {
            OdCutPaper cutPaper = odCutPaperRepository.findById(log.getOdCutPaperId())
                    .orElseThrow(() -> new RuntimeException("Cut Paper ID not found"));
            
            int remaining = cutPaper.getRemainingSmallSheets() - totalUsed;
            if (remaining <= 0) {
                remaining = 0;
                cutPaper.setStatus(OdCutPaper.Status.DEPLETED);
            }
            cutPaper.setRemainingSmallSheets(remaining);
            odCutPaperRepository.save(cutPaper);

            OdCutPaperUsageLog usageLog = OdCutPaperUsageLog.builder()
                    .odCutPaper(cutPaper)
                    .job(log.getJob())
                    .printLog(log)
                    .usedSheets(totalUsed)
                    .operatorName(operatorName)
                    .note(req.getNote() != null ? req.getNote() : "หักสต็อคกระดาษแผ่นเล็กจากการใช้งาน")
                    .build();
            odCutPaperUsageLogRepository.save(usageLog);
        } else if (isFinishing && log.getLotId() != null && log.getOdCutPaperId() == null && totalUsed > 0) {
            // DIRECT_LOT deduction
            Lot lot = lotRepository.findById(log.getLotId())
                    .orElseThrow(() -> new RuntimeException("Lot ID not found"));
            
            double currentBaseQty = lot.getBaseQty() != null ? lot.getBaseQty() : 0.0;
            lot.setBaseQty(Math.max(0, currentBaseQty - totalUsed));
            lotRepository.save(lot);

            StockLog stockLog = StockLog.builder()
                    .lotId(lot.getId())
                    .materialId(lot.getMaterial() != null ? lot.getMaterial().getId() : null)
                    .transactionType(StockLog.TransactionType.OUT)
                    .quantityMajor(java.math.BigDecimal.ZERO)
                    .quantityMinor(java.math.BigDecimal.valueOf(totalUsed))
                    .totalSheets(totalUsed)
                    .referenceJobId(log.getJob() != null ? log.getJob().getId() : null)
                    .operatorName(operatorName)
                    .note(req.getNote() != null && !req.getNote().isEmpty() ? req.getNote() : "ใช้งานกระดาษเข้าเครื่องพิมพ์ OD โดยตรง")
                    .build();
            stockLogService.logTransaction(stockLog);
        }

        PrintJob job = log.getJob();
        if (job != null) {
            if ("FINISH".equalsIgnoreCase(req.getAction())) {
                job.setJobStatus("พิมพ์เสร็จแล้ว");
            } else if ("PAUSE".equalsIgnoreCase(req.getAction())) {
                job.setJobStatus("หยุดชั่วคราว");
            } else if ("WAITPAGE2".equalsIgnoreCase(req.getAction())) {
                job.setJobStatus("รอพิมพ์หน้า 2");
            } else if ("PAUSED_PAGE2".equalsIgnoreCase(req.getAction())) {
                job.setJobStatus("หยุดชั่วคราว (หน้า 2)");
            } else if ("FINISH_PAGE2".equalsIgnoreCase(req.getAction())) {
                job.setJobStatus("พิมพ์เสร็จแล้ว");
            }
            jobRepository.save(job);

            // Update cumulative good/waste quantities
            List<PrintLog> allLogs = printLogRepository.findByJobIdOrderByStartedAtDesc(job.getId());
            int totalGood = allLogs.stream().mapToInt(l -> l.getGoodQty() != null ? l.getGoodQty() : 0).sum();
            int totalWaste = allLogs.stream().mapToInt(l -> l.getWasteQty() != null ? l.getWasteQty() : 0).sum();
            job.setGoodQty(totalGood);
            job.setWasteQty(totalWaste);
            jobRepository.save(job);
        }

        return printLogRepository.save(log);
    }
}
