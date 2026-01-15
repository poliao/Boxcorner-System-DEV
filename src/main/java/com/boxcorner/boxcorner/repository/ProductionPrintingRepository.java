package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProductionPrinting;

@Repository
public interface ProductionPrintingRepository extends JpaRepository<ProductionPrinting, Integer> {
}
