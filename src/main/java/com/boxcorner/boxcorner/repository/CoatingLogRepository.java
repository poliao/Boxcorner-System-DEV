package com.boxcorner.boxcorner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.CoatingLog;

@Repository
public interface CoatingLogRepository extends JpaRepository<CoatingLog, Integer> {

    @Query("SELECT p FROM CoatingLog p WHERE " +
            "(:id IS NULL OR :id = '' OR CAST(p.id AS string) LIKE %:id%) AND " +
            "(:joId IS NULL OR :joId = '' OR p.joId LIKE %:joId%) AND " +
            "(:technicianName IS NULL OR :technicianName = '' OR p.technicianName LIKE %:technicianName%)")
    Page<CoatingLog> findByFilters(@Param("id") String id,
            @Param("joId") String joId,
            @Param("technicianName") String technicianName,
            Pageable pageable);
}
