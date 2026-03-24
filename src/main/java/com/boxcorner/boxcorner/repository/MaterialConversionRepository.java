package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.MaterialConversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialConversionRepository extends JpaRepository<MaterialConversion, Integer> {
    List<MaterialConversion> findByMaterialId(Integer materialId);
}
