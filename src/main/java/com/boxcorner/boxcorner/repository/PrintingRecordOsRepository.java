package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PrintingRecordOs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrintingRecordOsRepository extends JpaRepository<PrintingRecordOs, Long> {
}