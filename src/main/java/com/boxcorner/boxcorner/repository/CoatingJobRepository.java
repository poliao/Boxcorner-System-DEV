package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.boxcorner.boxcorner.entity.CoatingJob;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CoatingJobRepository extends JpaRepository<CoatingJob, Integer> {

    boolean existsByJoId(String joId);

    java.util.List<CoatingJob> findByJoId(String joId);

    @Query(value = """
            SELECT * FROM coating_jobs c
            WHERE
                (:joId IS NULL OR :joId = '' OR UPPER(c.jo_id) LIKE UPPER(CONCAT('%', :joId, '%')))
                AND (:jobCustomerName IS NULL OR :jobCustomerName = '' OR UPPER(c.job_customer_name) LIKE UPPER(CONCAT('%', :jobCustomerName, '%')))
                AND (:jobOwnerName IS NULL OR :jobOwnerName = '' OR UPPER(c.job_owner_name) LIKE UPPER(CONCAT('%', :jobOwnerName, '%')))
                AND (:technicianName IS NULL OR :technicianName = '' OR UPPER(c.technician_name) LIKE UPPER(CONCAT('%', :technicianName, '%')))
            ORDER BY c.id DESC
            """, countQuery = """
            SELECT count(*) FROM coating_jobs c
            WHERE
                (:joId IS NULL OR :joId = '' OR UPPER(c.jo_id) LIKE UPPER(CONCAT('%', :joId, '%')))
                AND (:jobCustomerName IS NULL OR :jobCustomerName = '' OR UPPER(c.job_customer_name) LIKE UPPER(CONCAT('%', :jobCustomerName, '%')))
                AND (:jobOwnerName IS NULL OR :jobOwnerName = '' OR UPPER(c.job_owner_name) LIKE UPPER(CONCAT('%', :jobOwnerName, '%')))
                AND (:technicianName IS NULL OR :technicianName = '' OR UPPER(c.technician_name) LIKE UPPER(CONCAT('%', :technicianName, '%')))
            """, nativeQuery = true)
    Page<CoatingJob> findByFilters(
            @Param("joId") String joId,
            @Param("jobCustomerName") String jobCustomerName,
            @Param("jobOwnerName") String jobOwnerName,
            @Param("technicianName") String technicianName,
            Pageable pageable);
}
