package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.PrintingRecord;
import com.boxcorner.boxcorner.repository.PrintingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrintingRecordService {

    @Autowired
    private PrintingRecordRepository printingRecordRepository;

    public PrintingRecord save(PrintingRecord printingRecord) {
        if (printingRecord.getId() != null) {
            PrintingRecord existing = printingRecordRepository.findById(printingRecord.getId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสำหรับการอัปเดต ID: " + printingRecord.getId()));

            if (printingRecord.getRowVersion() != null && !existing.getRowVersion().equals(printingRecord.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            existing.setReferenceId(printingRecord.getReferenceId());
            existing.setDeliveryTableId(printingRecord.getDeliveryTableId());
            existing.setJobId(printingRecord.getJobId());
            existing.setMeter4colorStart(printingRecord.getMeter4colorStart());
            existing.setMeter4colorEnd(printingRecord.getMeter4colorEnd());
            existing.setMeterBwStart(printingRecord.getMeterBwStart());
            existing.setMeterBwEnd(printingRecord.getMeterBwEnd());
            existing.setIssueFound(printingRecord.getIssueFound());
            existing.setIssueCause(printingRecord.getIssueCause());
            existing.setWorkType(printingRecord.getWorkType());
            existing.setPrinterName(printingRecord.getPrinterName());
            existing.setJobCategory(printingRecord.getJobCategory());
            existing.setOrderPrintQty(printingRecord.getOrderPrintQty());
            existing.setOrderProduceQty(printingRecord.getOrderProduceQty());
            existing.setStartDatetime(printingRecord.getStartDatetime());
            existing.setEndDatetime(printingRecord.getEndDatetime());
            existing.setResponsiblePerson(printingRecord.getResponsiblePerson());
            existing.setCreatedAt(printingRecord.getCreatedAt());
            existing.setPrintQty4color(printingRecord.getPrintQty4color());
            existing.setPrintQtyBw(printingRecord.getPrintQtyBw());
            existing.setPrintQtyTotal(printingRecord.getPrintQtyTotal());
            existing.setMeterWStart(printingRecord.getMeterWStart());
            existing.setMeterWEnd(printingRecord.getMeterWEnd());
            existing.setNextMeter4colorStart(printingRecord.getNextMeter4colorStart());
            existing.setNextMeter4colorEnd(printingRecord.getNextMeter4colorEnd());
            existing.setNextMeterBwStart(printingRecord.getNextMeterBwStart());
            existing.setNextMeterBwEnd(printingRecord.getNextMeterBwEnd());
            existing.setNextMeterWStart(printingRecord.getNextMeterWStart());
            existing.setNextMeterWEnd(printingRecord.getNextMeterWEnd());
            existing.setPage2Meter4colorStart(printingRecord.getPage2Meter4colorStart());
            existing.setPage2Meter4colorEnd(printingRecord.getPage2Meter4colorEnd());
            existing.setPage2MeterBwStart(printingRecord.getPage2MeterBwStart());
            existing.setPage2MeterBwEnd(printingRecord.getPage2MeterBwEnd());
            existing.setPage2MeterWStart(printingRecord.getPage2MeterWStart());
            existing.setPage2MeterWEnd(printingRecord.getPage2MeterWEnd());
            existing.setNextPage2Meter4colorStart(printingRecord.getNextPage2Meter4colorStart());
            existing.setNextPage2Meter4colorEnd(printingRecord.getNextPage2Meter4colorEnd());
            existing.setNextPage2MeterBwStart(printingRecord.getNextPage2MeterBwStart());
            existing.setNextPage2MeterBwEnd(printingRecord.getNextPage2MeterBwEnd());
            existing.setNextPage2MeterWStart(printingRecord.getNextPage2MeterWStart());
            existing.setNextPage2MeterWEnd(printingRecord.getNextPage2MeterWEnd());
            existing.setIssueFoundPage2(printingRecord.getIssueFoundPage2());
            existing.setIssueCausePage2(printingRecord.getIssueCausePage2());
            existing.setNextPage2PrinterName(printingRecord.getNextPage2PrinterName()); // NextPage2PrinterName
            existing.setNextPrinterName(printingRecord.getNextPrinterName());
            existing.setPage2PrinterName(printingRecord.getPage2PrinterName());

            return printingRecordRepository.save(existing);
        } else {
            return printingRecordRepository.save(printingRecord);
        }
    }

    public Optional<PrintingRecord> findById(Integer id) {
        return printingRecordRepository.findById(id);
    }

    public List<PrintingRecord> findAll() {
        return printingRecordRepository.findAll();
    }

    public void deleteById(Integer id) {
        printingRecordRepository.deleteById(id);
    }
}