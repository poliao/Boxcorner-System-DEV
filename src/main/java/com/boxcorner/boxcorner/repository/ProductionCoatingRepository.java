package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProductionCoating;

@Repository
public interface ProductionCoatingRepository extends JpaRepository<ProductionCoating, Integer> {
}
