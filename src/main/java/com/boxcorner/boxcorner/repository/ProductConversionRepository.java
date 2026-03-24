package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.ProductConversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductConversionRepository extends JpaRepository<ProductConversion, Integer> {
    List<ProductConversion> findByProductId(Integer productId);
}
