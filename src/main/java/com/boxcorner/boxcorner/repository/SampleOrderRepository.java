package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.boxcorner.boxcorner.entity.SampleOrder;

public interface SampleOrderRepository extends JpaRepository<SampleOrder, Integer> {
    
}
