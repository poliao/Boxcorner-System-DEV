package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.Province;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Integer> {
    
    @Query("SELECT p FROM Province p WHERE " +
           "LOWER(p.nameTh) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.nameEn) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Province> searchProvinces(@Param("search") String search, Pageable pageable);
}
