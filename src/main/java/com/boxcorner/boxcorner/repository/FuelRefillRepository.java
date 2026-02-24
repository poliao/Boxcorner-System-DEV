package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.FuelRefill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuelRefillRepository extends JpaRepository<FuelRefill, Long> {
}
