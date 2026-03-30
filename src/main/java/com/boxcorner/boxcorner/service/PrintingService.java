package com.boxcorner.boxcorner.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.boxcorner.boxcorner.entity.BaseEntity.LogType;
import com.boxcorner.boxcorner.entity.BaseEntity.PrintSide;
import com.boxcorner.boxcorner.entity.PaperInventory;
import com.boxcorner.boxcorner.entity.PrintJob;
import com.boxcorner.boxcorner.entity.PrintLog;
import com.boxcorner.boxcorner.entity.Printer;
import com.boxcorner.boxcorner.entity.StockLog;
import com.boxcorner.boxcorner.entity.UnitStock;
import com.boxcorner.boxcorner.entity.dto.CalibrateRequest;
import com.boxcorner.boxcorner.entity.dto.ReturnPaperRequest;
import com.boxcorner.boxcorner.entity.dto.StartPrintRequest;
import com.boxcorner.boxcorner.entity.dto.StopPrintRequest;
import com.boxcorner.boxcorner.repository.PrintJobRepository;
import com.boxcorner.boxcorner.repository.PrintLogRepository;
import com.boxcorner.boxcorner.repository.PrinterRepository;
import com.boxcorner.boxcorner.repository.UnitStockRepository;
import com.boxcorner.boxcorner.repository.PaperInventoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrintingService {

    private final PrintLogRepository printLogRepository;
    private final PrintJobRepository jobRepository;
    private final PrinterRepository printerRepository;
    private final UnitStockRepository unitStockRepository;
    private final PaperInventoryRepository paperInventoryRepository;
    private final StockLogService stockLogService;

    // =========================================================================
    // 1. ACTION: START (เริ่มงาน / พิมพ์ต่อ / พิมพ์ซ่อม)
    // =========================================================================
    @Transactional
    public PrintLog startPrinting(StartPrintRequest req, String operatorName) {

        PrintJob job = null;
        if (req.getJobId() != null) {
            job = jobRepository.findById(req.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job ID not found: " + req.getJobId()));
        }

        Printer printer = printerRepository.findById(req.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer ID not found: " + req.getPrinterId()));

        Optional<PrintLog> activeLog = printLogRepository.findByPrinterIdAndEndedAtIsNull(printer.getId());
        if (activeLog.isPresent()) {
            throw new RuntimeException(
                    "เครื่องนี้มีงานค้างอยู่ (ลำดับงานที่: "
                            + (activeLog.get().getJob() != null ? activeLog.get().getJob().getId() : "ไม่มี Job ID")
                            + ") กรุณาจบงานก่อน");
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
                .unitStockId(req.getUnitStockId())
                .operatorName(operatorName)
                .build();

        // 4. Update Job Status -> IN_PROGRESS
        if (job != null) {
            if ("รอพิมพ์".equals(job.getJobStatus()) || "หยุดชั่วคราว".equals(job.getJobStatus())) {
                job.setJobStatus("กำลังพิมพ์ด้านหน้า");
                jobRepository.save(job);
            } else if ("รอพิมพ์หน้า 2".equals(job.getJobStatus())
                    || "หยุดชั่วคราว (หน้า 2)".equals(job.getJobStatus())) {
                job.setJobStatus("กำลังพิมพ์ด้านหลัง");
                jobRepository.save(job);
            }
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
        log.setGoodQty(req.getGoodQty());
        log.setWasteQty(req.getWasteQty());

        // 3. Obtain Total Impressions (ยอดที่พิมพ์จริงและเผื่อเสีย) from form
        long totalUsed = (req.getPaperUsed() != null) ? req.getPaperUsed() : 0;
        log.setTotalSheetsUsed((int) totalUsed);

        // 3.5 Deduct Paper Inventory if action is FINISH and unitStockId is provided
        if (("FINISH".equalsIgnoreCase(req.getAction()) || "FINISH_PAGE2".equalsIgnoreCase(req.getAction())
                || "WAITPAGE2".equalsIgnoreCase(req.getAction()))
                && log.getUnitStockId() != null && totalUsed > 0) {

            com.boxcorner.boxcorner.entity.UnitStock stockMaster = unitStockRepository.findById(log.getUnitStockId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบ UnitStock ID: " + log.getUnitStockId()));

            com.boxcorner.boxcorner.entity.PaperInventory inventory = paperInventoryRepository
                    .findByUnitStockId(log.getUnitStockId())
                    .orElseThrow(
                            () -> new RuntimeException("ไม่พบสต็อคกระดาษสำหรับ UnitStock ID: " + log.getUnitStockId()));

            java.math.BigDecimal majorQtyUnit = stockMaster.getMajorQuantity();
            java.math.BigDecimal minorQtyUnit = stockMaster.getMinorQuantity();

            if (majorQtyUnit != null && minorQtyUnit != null && majorQtyUnit.compareTo(java.math.BigDecimal.ZERO) > 0) {
                // หาว่าเวลา 1 ห่อมีกี่ใบ (sheets per ream) โดยเอา minor / major
                java.math.BigDecimal sheetsPerReam = minorQtyUnit.divide(majorQtyUnit, 2,
                        java.math.RoundingMode.HALF_UP);

                if (sheetsPerReam.compareTo(java.math.BigDecimal.ZERO) > 0) {
                    // คำนวณสต็อคปัจจุบันเป็นหน่วยย่อย (ใบ) ทั้งหมด
                    java.math.BigDecimal currentTotalMinor = inventory.getCurrentMajorQty().multiply(sheetsPerReam)
                            .add(inventory.getCurrentMinorQty());

                    // หักลบจำนวนที่ใช้พิมพ์
                    java.math.BigDecimal newTotalMinor = currentTotalMinor
                            .subtract(java.math.BigDecimal.valueOf(totalUsed));
                    if (newTotalMinor.compareTo(java.math.BigDecimal.ZERO) < 0) {
                        newTotalMinor = java.math.BigDecimal.ZERO; // ไม่ให้ติดลบ
                    }

                    // แปลงกลับเป็นหน่วยหลักและหน่วยย่อย
                    java.math.BigDecimal[] divAndRem = newTotalMinor.divideAndRemainder(sheetsPerReam);
                    inventory.setCurrentMajorQty(divAndRem[0]);
                    inventory.setCurrentMinorQty(divAndRem[1]);

                    paperInventoryRepository.save(inventory);

                    // Add StockLog OUT
                    StockLog stockLog = StockLog.builder()
                            .unitStockId(stockMaster.getId())
                            .transactionType(StockLog.TransactionType.OUT)
                            .quantityMajor(java.math.BigDecimal.ZERO)
                            .quantityMinor(java.math.BigDecimal.valueOf(totalUsed))
                            .totalSheets((int) totalUsed)
                            .referenceJobId(log.getJob() != null ? log.getJob().getId() : null)
                            .operatorName(log.getOperatorName())
                            .note("ตัดสต็อคกระดาษจากการพิมพ์ (Job: "
                                    + (log.getJob() != null ? log.getJob().getJobId() : "-") + ")")
                            .build();
                    stockLogService.logTransaction(stockLog);
                }
            }
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

    @Transactional
    public void returnPaper(ReturnPaperRequest request) {
        if (request.getUnitStockId() != null && request.getReturnQty() != null && request.getReturnQty() > 0) {

            PrintJob printJob = null;
            if (request.getPrintJobId() != null) {
                printJob = jobRepository.findById(request.getPrintJobId())
                        .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูล PrintJob / PrintJob not found"));

                if (printJob.getSetupWaste() == null || request.getReturnQty() > printJob.getSetupWaste()) {
                    throw new RuntimeException("จำนวนกระดาษที่คืนต้องไม่เกินยอดตั้งเครื่องที่เหลือ ("
                            + (printJob.getSetupWaste() == null ? 0 : printJob.getSetupWaste()) + " แผ่น)");
                }
            }

            UnitStock unitStock = unitStockRepository.findById(request.getUnitStockId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลกระดาษ / UnitStock not found"));

            PaperInventory paperInventory = paperInventoryRepository.findByUnitStockId(unitStock.getId())
                    .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสต็อคกระดาษ / Paper inventory not found"));

            java.math.BigDecimal majorQuantity = unitStock.getMajorQuantity();
            if (majorQuantity == null || majorQuantity.compareTo(java.math.BigDecimal.ZERO) == 0) {
                majorQuantity = java.math.BigDecimal.ONE;
            }

            java.math.BigDecimal minorQuantity = unitStock.getMinorQuantity();
            if (minorQuantity == null || minorQuantity.compareTo(java.math.BigDecimal.ZERO) == 0) {
                minorQuantity = java.math.BigDecimal.ONE;
            }

            java.math.BigDecimal sheetsPerReam = minorQuantity.divide(majorQuantity, 2, java.math.RoundingMode.HALF_UP);

            java.math.BigDecimal currentMajor = paperInventory.getCurrentMajorQty() != null
                    ? paperInventory.getCurrentMajorQty()
                    : java.math.BigDecimal.ZERO;
            java.math.BigDecimal currentMinor = paperInventory.getCurrentMinorQty() != null
                    ? paperInventory.getCurrentMinorQty()
                    : java.math.BigDecimal.ZERO;

            java.math.BigDecimal totalCurrentSheets = currentMajor.multiply(sheetsPerReam).add(currentMinor);

            // Add the returned quantity
            java.math.BigDecimal returnedAmount = new java.math.BigDecimal(request.getReturnQty());
            java.math.BigDecimal newTotalSheets = totalCurrentSheets.add(returnedAmount);

            java.math.BigDecimal[] divisionResult = newTotalSheets.divideAndRemainder(sheetsPerReam);
            java.math.BigDecimal newMajorQty = divisionResult[0];
            java.math.BigDecimal newMinorQty = divisionResult[1];

            paperInventory.setCurrentMajorQty(newMajorQty);
            paperInventory.setCurrentMinorQty(newMinorQty);

            if (printJob != null) {
                printJob.setSetupWaste(printJob.getSetupWaste() - request.getReturnQty());
                jobRepository.save(printJob);
            }

            paperInventoryRepository.save(paperInventory);

            // Add StockLog RETURN
            StockLog stockLog = StockLog.builder()
                    .unitStockId(unitStock.getId())
                    .transactionType(StockLog.TransactionType.RETURN)
                    .quantityMajor(BigDecimal.ZERO)
                    .quantityMinor(returnedAmount)
                    .totalSheets(request.getReturnQty())
                    .referenceJobId(printJob != null ? printJob.getId() : null)
                    .operatorName("SYSTEM") // We don't have operatorName in ReturnPaperRequest right now
                    .note("คืนกระดาษจากการพิมพ์ (Job: " + (printJob != null ? printJob.getJobId() : "-") + ")")
                    .build();
            stockLogService.logTransaction(stockLog);
        }
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

    public List<PrintLog> getLogsByJobId(Long jobId) {
        return printLogRepository.findByJobIdOrderByStartedAtDesc(jobId);
    }

    public Map<Long, List<PrintLog>> getBatchLogs(List<Long> jobIds) {
        List<PrintLog> logs = printLogRepository.findByJobIdIn(jobIds);
        return logs.stream().collect(Collectors.groupingBy(log -> log.getJob().getId()));
    }

    public org.springframework.data.domain.Page<PrintLog> searchLogs(Long id, String jobId, String customerJobName,
            Boolean issample, String jobStatus, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate,
            int page, int size) {
        org.springframework.data.domain.Pageable paging = org.springframework.data.domain.PageRequest.of(page, size);
        return printLogRepository.findByFilters(id, jobId, customerJobName, issample, jobStatus, startDate, endDate,
                paging);
    }

    public java.util.List<java.util.Map<String, Object>> getLogSummary(Long id, String jobId, String customerJobName,
            Boolean issample, String jobStatus, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        return printLogRepository.getLogSummary(id, jobId, customerJobName, issample, jobStatus, startDate, endDate);
    }

    public List<PrintLog> getStandaloneLogs(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        return printLogRepository.findStandaloneLogs(startDate, endDate);
    }
}