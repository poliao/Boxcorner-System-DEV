package com.boxcorner.boxcorner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProductionStamping;

@Repository
public interface ProductionStampingRepository extends JpaRepository<ProductionStamping, Integer> {
    
    @Query("SELECT p FROM ProductionStamping p WHERE " +
           "(:id IS NULL OR :id = '' OR CAST(p.id AS string) LIKE %:id%) AND " +
           "(:jobOrderNo IS NULL OR :jobOrderNo = '' OR p.jobOrderNo LIKE %:jobOrderNo%) AND " +
           "(:jobName IS NULL OR :jobName = '' OR p.jobName LIKE %:jobName%)")
    Page<ProductionStamping> findByFilters(@Param("id") String id, 
                                          @Param("jobOrderNo") String jobOrderNo, 
                                          @Param("jobName") String jobName, 
                                          Pageable pageable);
}
