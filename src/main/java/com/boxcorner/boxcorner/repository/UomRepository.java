package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.Uom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UomRepository extends JpaRepository<Uom, Integer> {
}
