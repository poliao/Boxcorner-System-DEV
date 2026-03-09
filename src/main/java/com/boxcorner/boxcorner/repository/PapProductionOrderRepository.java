package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PapProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PapProductionOrderRepository extends JpaRepository<PapProductionOrder, Long> {
    Optional<PapProductionOrder> findByJobCode(String jobCode);
}
