package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PrintingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrintingRecordRepository extends JpaRepository<PrintingRecord, Integer> {
}