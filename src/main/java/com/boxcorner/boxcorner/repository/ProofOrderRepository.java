package com.boxcorner.boxcorner.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProofOrder;

@Repository
public interface ProofOrderRepository extends JpaRepository<ProofOrder, Long> {
    Optional<ProofOrder> findByProductionOrderId(Integer productionOrderId);
}
