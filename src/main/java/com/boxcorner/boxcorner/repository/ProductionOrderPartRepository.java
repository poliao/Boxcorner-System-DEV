package com.boxcorner.boxcorner.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.boxcorner.boxcorner.entity.ProductionOrderPart;

public interface ProductionOrderPartRepository extends JpaRepository<ProductionOrderPart, Long> {
    List<ProductionOrderPart> findByProductionOrderId(Integer productionOrderId);
    void deleteByProductionOrderId(Integer productionOrderId);
}
