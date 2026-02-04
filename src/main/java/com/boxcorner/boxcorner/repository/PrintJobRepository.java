package com.boxcorner.boxcorner.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.PrintJob;

import java.util.List;

@Repository
public interface PrintJobRepository extends JpaRepository<PrintJob, Long> {
    // ค้นหาคิวงานตามเครื่องพิมพ์
    List<PrintJob> findByPrinterName(String printerName);
    
    // ค้นหาตามสถานะงาน
    List<PrintJob> findByJobStatus(String status);
}