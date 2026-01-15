package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProductionStamping;

@Repository
public interface ProductionStampingRepository extends JpaRepository<ProductionStamping, Integer> {
}
