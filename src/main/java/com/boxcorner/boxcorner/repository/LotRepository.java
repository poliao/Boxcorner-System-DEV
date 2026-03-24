package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LotRepository extends JpaRepository<Lot, Integer> {
    List<Lot> findByMaterialId(Integer materialId);
}
