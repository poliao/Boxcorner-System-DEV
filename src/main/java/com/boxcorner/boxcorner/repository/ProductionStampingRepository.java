package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.ProductionStamping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductionStampingRepository extends JpaRepository<ProductionStamping, Integer> {

    @Query(value = "SELECT * FROM production_stamping WHERE job_order_no = :jobOrderNo ORDER BY id ASC", nativeQuery = true)
    List<ProductionStamping> findByJobOrderNo(@Param("jobOrderNo") String jobOrderNo);

    @Query(value = """
            SELECT * FROM production_stamping s
            WHERE
                (:id IS NULL OR :id = '' OR CAST(s.id AS TEXT) LIKE CONCAT('%', :id, '%'))
                AND (:jobOrderNo IS NULL OR :jobOrderNo = '' OR UPPER(s.job_order_no) LIKE UPPER(CONCAT('%', :jobOrderNo, '%')))
                AND (:jobName IS NULL OR :jobName = '' OR UPPER(s.job_name) LIKE UPPER(CONCAT('%', :jobName, '%')))
            ORDER BY s.id DESC
            """, countQuery = """
            SELECT count(*) FROM production_stamping s
            WHERE
                (:id IS NULL OR :id = '' OR CAST(s.id AS TEXT) LIKE CONCAT('%', :id, '%'))
                AND (:jobOrderNo IS NULL OR :jobOrderNo = '' OR UPPER(s.job_order_no) LIKE UPPER(CONCAT('%', :jobOrderNo, '%')))
                AND (:jobName IS NULL OR :jobName = '' OR UPPER(s.job_name) LIKE UPPER(CONCAT('%', :jobName, '%')))
            """, nativeQuery = true)
    Page<ProductionStamping> findByFilters(
            @Param("id") String id,
            @Param("jobOrderNo") String jobOrderNo,
            @Param("jobName") String jobName,
            Pageable pageable);
}
