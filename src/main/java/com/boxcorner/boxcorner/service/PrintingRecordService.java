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