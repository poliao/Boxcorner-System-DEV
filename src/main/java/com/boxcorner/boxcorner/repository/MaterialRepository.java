package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MaterialRepository extends JpaRepository<Material, Integer> {

    @Query("SELECT m FROM Material m WHERE " +
            "(:searchTerm IS NULL OR :searchTerm = '' OR " +
            "LOWER(m.materialName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(m.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Material> searchMaterials(@Param("searchTerm") String searchTerm, Pageable pageable);
}
