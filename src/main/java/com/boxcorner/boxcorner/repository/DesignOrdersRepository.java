package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.DesignOrders;

@Repository
public interface DesignOrdersRepository extends JpaRepository<DesignOrders, Integer> {

              @Query(value = """
                            SELECT * FROM design_orders d
                            WHERE
                                (:jobDetails IS NULL OR :jobDetails = '' OR UPPER(d.job_details) LIKE UPPER(CONCAT('%', :jobDetails, '%')))
                                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(d.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                                AND (:assignee IS NULL OR :assignee = '' OR UPPER(d.assignee) LIKE UPPER(CONCAT('%', :assignee, '%')))
                                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(d.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                                AND (:confirm IS NULL OR :confirm = '' OR UPPER(d.confirm_status) LIKE UPPER(CONCAT('%', :confirm, '%')))
                                AND (CAST(:startDate AS TEXT) = '' OR d.order_date >= CAST(:startDate AS DATE))
                                AND (CAST(:endDate AS TEXT) = '' OR d.order_date <= CAST(:endDate AS DATE))
                            ORDER BY d.id DESC
                            """, countQuery = "SELECT count(*) FROM design_orders", // สำหรับทำ Pagination
                            nativeQuery = true)
              Page<DesignOrders> findByFilters(
                            @Param("jobDetails") String jobDetails,
                            @Param("jobOwner") String jobOwner,
                            @Param("assignee") String assignee,
                            @Param("processStatus") String processStatus,
                            @Param("confirm") String confirm,
                            @Param("startDate") LocalDate startDate,
                            @Param("endDate") LocalDate endDate,
                            Pageable pageable);
       

       @Query(value = "SELECT DISTINCT job_details FROM design_orders " +
                     "WHERE (:query IS NULL OR UPPER(job_details) LIKE CONCAT('%', UPPER(:query), '%')) " +
                     "ORDER BY job_details ASC LIMIT 20", nativeQuery = true)
       List<String> JobDetailsNative(@Param("query") String query);

       @Query(value = "SELECT DISTINCT job_owner FROM design_orders " +
                     "WHERE job_owner IS NOT NULL AND job_owner != '' AND (:query IS NULL OR UPPER(job_owner) LIKE CONCAT('%', UPPER(:query), '%')) "
                     +
                     "ORDER BY job_owner ASC LIMIT 20", nativeQuery = true)
       List<String> JobOwnerNative(@Param("query") String query);

       @Query(value = "SELECT DISTINCT assignee FROM design_orders " +
                     "WHERE (:query IS NULL OR UPPER(assignee) LIKE CONCAT('%', UPPER(:query), '%')) " +
                     "ORDER BY assignee ASC LIMIT 20", nativeQuery = true)
       List<String> AssigneeNative(@Param("query") String query);

       @Query(value = "SELECT DISTINCT process_status FROM design_orders " +
                     "WHERE (:query IS NULL OR UPPER(process_status) LIKE CONCAT('%', UPPER(:query), '%')) " +
                     "ORDER BY process_status ASC LIMIT 20", nativeQuery = true)
       List<String> ProcessNative(@Param("query") String query);

       @Query(value = "SELECT DISTINCT confirm_status FROM design_orders " +
                     "WHERE (:query IS NULL OR UPPER(confirm_status) LIKE CONCAT('%', UPPER(:query), '%')) " +
                     "ORDER BY confirm_status ASC LIMIT 20", nativeQuery = true)
       List<String> ConfirmNative(@Param("query") String query);
}