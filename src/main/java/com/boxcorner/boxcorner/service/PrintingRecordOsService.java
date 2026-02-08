package com.boxcorner.boxcorner.service;

import com.boxcorner.boxcorner.entity.PrintingRecordOs;
import com.boxcorner.boxcorner.repository.PrintingRecordOsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PrintingRecordOsService {

    @Autowired
    private PrintingRecordOsRepository repository;

    @Transactional
    public PrintingRecordOs savePrintingRecord(PrintingRecordOs printingRecord, String currentUser) {
        if (printingRecord.getId() != null) {
            // --- กรณี Update ---
            PrintingRecordOs existing = repository.findById(printingRecord.getId())
                    .orElseThrow(
                            () -> new RuntimeException("ไม่พบข้อมูลสำหรับการอัปเดต ID: " + printingRecord.getId()));

   
            if (printingRecord.getRowVersion() != null
                    && !existing.getRowVersion().equals(printingRecord.getRowVersion())) {
                throw new RuntimeException("ข้อมูลถูกแก้ไขโดยผู้อื่นแล้ว กรุณาโหลดข้อมูลใหม่");
            }

            // อัปเดตข้อมูลทีละ Field (Manual Mapping)
            existing.setStartDatetime(printingRecord.getStartDatetime());
            existing.setJobNumber(printingRecord.getJobNumber());
            existing.setCustomerName(printingRecord.getCustomerName());
            existing.setMachineName(printingRecord.getMachineName());
            existing.setTechnicianName(printingRecord.getTechnicianName());
            existing.setPaperType(printingRecord.getPaperType());
            existing.setPaperGram(printingRecord.getPaperGram());
            existing.setPaperLot(printingRecord.getPaperLot());

            // ค่าทางเทคนิค
            existing.setWaterTempCelsius(printingRecord.getWaterTempCelsius());
            existing.setIpaPercent(printingRecord.getIpaPercent());
            existing.setConductivityUs(printingRecord.getConductivityUs());
            existing.setAirPressureBar(printingRecord.getAirPressureBar());
            existing.setHasCmyk(printingRecord.getHasCmyk());
            existing.setHasSpecialColor(printingRecord.getHasSpecialColor());
            existing.setInkAgeType(printingRecord.getInkAgeType());

            // ข้อมูลหมึก (CMYK)
            existing.setCLotNo(printingRecord.getCLotNo());
            existing.setCBrand(printingRecord.getCBrand());
            existing.setMLotNo(printingRecord.getMLotNo());
            existing.setMBrand(printingRecord.getMBrand());
            existing.setYLotNo(printingRecord.getYLotNo());
            existing.setYBrand(printingRecord.getYBrand());
            existing.setKLotNo(printingRecord.getKLotNo());
            existing.setKBrand(printingRecord.getKBrand());

            // Checklist
            existing.setIsPlatePerfect(printingRecord.getIsPlatePerfect());
            existing.setIsBlanketOk(printingRecord.getIsBlanketOk());
            existing.setIsMachineCleaned(printingRecord.getIsMachineCleaned());

            // การตัดสินใจ
            existing.setColorReferenceSource(printingRecord.getColorReferenceSource());
            existing.setDecisionAuthority(printingRecord.getDecisionAuthority());
            existing.setDeciderName(printingRecord.getDeciderName());
            existing.setDecisionRemark(printingRecord.getDecisionRemark());

            return repository.save(existing);

        } else {
            printingRecord.setCreatedAt(LocalDateTime.now());
            printingRecord.setTechnicianName(currentUser);

            return repository.save(printingRecord);
        }
    }
}