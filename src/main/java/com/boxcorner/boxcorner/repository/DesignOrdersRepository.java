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
                            AND (:processStatus IS NULL OR :processStatus = '' OR d.process_status = :processStatus)
                            AND (:confirm IS NULL OR :confirm = '' OR d.confirm_status = :confirm)
                            AND (CAST(:startDate AS DATE) IS NULL OR d.order_date >= :startDate)
                            AND (CAST(:endDate AS DATE) IS NULL OR d.order_date <= :endDate)
                        ORDER BY d.id DESC
                        """, countQuery = "SELECT count(*) FROM design_orders", nativeQuery = true)
        Page<DesignOrders> findByFilters(
                        @Param("jobDetails") String jobDetails,
                        @Param("jobOwner") String jobOwner,
                        @Param("assignee") String assignee,
                        @Param("processStatus") String processStatus,
                        @Param("confirm") String confirm,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        @Query(value = """
                        SELECT * FROM design_orders d
                        WHERE
                            (:id IS NULL OR :id = '' OR CAST(d.id AS TEXT) LIKE CONCAT('%', :id, '%'))
                            AND (:folderName IS NULL OR :folderName = '' OR UPPER(d.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                            AND (:jobDetails IS NULL OR :jobDetails = '' OR UPPER(d.job_details) LIKE UPPER(CONCAT('%', :jobDetails, '%')))
                            AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(d.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                            AND (:assignee IS NULL OR :assignee = '' OR UPPER(d.assignee) LIKE UPPER(CONCAT('%', :assignee, '%')))
                            AND (:joId IS NULL OR :joId = '' OR UPPER(d.jo_id) LIKE UPPER(CONCAT('%', :joId, '%')) OR UPPER(d.qp_id) LIKE UPPER(CONCAT('%', :joId, '%')))
                            AND (:processStatus IS NULL OR :processStatus = '' OR d.process_status = :processStatus)
                            AND (:confirm IS NULL OR :confirm = '' OR d.confirm_status = :confirm)
                            AND (CAST(:startDate AS DATE) IS NULL OR d.order_date >= :startDate)
                            AND (CAST(:endDate AS DATE) IS NULL OR d.order_date <= :endDate)
                            AND (:hasRemarkAdd IS NULL OR (:hasRemarkAdd = true AND d.remark_add IS NOT NULL))
                            AND (:remarkStatus IS NULL OR :remarkStatus = '' OR d.remark_add = :remarkStatus)
                        ORDER BY d.id DESC
                        """, countQuery = """
                        SELECT count(*) FROM design_orders d
                        WHERE
                            (:id IS NULL OR :id = '' OR CAST(d.id AS TEXT) LIKE CONCAT('%', :id, '%'))
                            AND (:folderName IS NULL OR :folderName = '' OR UPPER(d.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                            AND (:jobDetails IS NULL OR :jobDetails = '' OR UPPER(d.job_details) LIKE UPPER(CONCAT('%', :jobDetails, '%')))
                            AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(d.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                            AND (:assignee IS NULL OR :assignee = '' OR UPPER(d.assignee) LIKE UPPER(CONCAT('%', :assignee, '%')))
                            AND (:joId IS NULL OR :joId = '' OR UPPER(d.jo_id) LIKE UPPER(CONCAT('%', :joId, '%')) OR UPPER(d.qp_id) LIKE UPPER(CONCAT('%', :joId, '%')))
                            AND (:processStatus IS NULL OR :processStatus = '' OR d.process_status = :processStatus)
                            AND (:confirm IS NULL OR :confirm = '' OR d.confirm_status = :confirm)
                            AND (CAST(:startDate AS DATE) IS NULL OR d.order_date >= :startDate)
                            AND (CAST(:endDate AS DATE) IS NULL OR d.order_date <= :endDate)
                            AND (:hasRemarkAdd IS NULL OR (:hasRemarkAdd = true AND d.remark_add IS NOT NULL))
                            AND (:remarkStatus IS NULL OR :remarkStatus = '' OR d.remark_add = :remarkStatus)
                        """, nativeQuery = true)
        Page<DesignOrders> findByAll(
                        @Param("id") String id,
                        @Param("folderName") String folderName,
                        @Param("jobDetails") String jobDetails,
                        @Param("jobOwner") String jobOwner,
                        @Param("assignee") String assignee,
                        @Param("joId") String joId,
                        @Param("processStatus") String processStatus,
                        @Param("confirm") String confirm,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("hasRemarkAdd") Boolean hasRemarkAdd,
                        @Param("remarkStatus") String remarkStatus,
                        Pageable pageable);

        @Query(value = """
                        SELECT * FROM design_orders d
                        WHERE
                            (:id IS NULL OR :id = '' OR CAST(d.id AS TEXT) LIKE CONCAT('%', :id, '%'))
                            AND (:folderName IS NULL OR :folderName = '' OR UPPER(d.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                            AND (:jobDetails IS NULL OR :jobDetails = '' OR UPPER(d.job_details) LIKE UPPER(CONCAT('%', :jobDetails, '%')))
                            AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(d.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                            AND (:assignee IS NULL OR :assignee = '' OR UPPER(d.assignee) LIKE UPPER(CONCAT('%', :assignee, '%')))
                            AND (:joId IS NULL OR :joId = '' OR UPPER(d.jo_id) LIKE UPPER(CONCAT('%', :joId, '%')) OR UPPER(d.qp_id) LIKE UPPER(CONCAT('%', :joId, '%')))
                            AND (:processStatus IS NULL OR :processStatus = '' OR d.process_status = :processStatus)
                            AND (:confirm IS NULL OR :confirm = '' OR d.confirm_status = :confirm)
                            AND (CAST(:startDate AS DATE) IS NULL OR d.order_date >= :startDate)
                            AND (CAST(:endDate AS DATE) IS NULL OR d.order_date <= :endDate)
                            AND (:hasRemarkAdd IS NULL OR (:hasRemarkAdd = true AND d.remark_add IS NOT NULL))
                            AND (:remarkStatus IS NULL OR :remarkStatus = '' OR d.remark_add = :remarkStatus)
                        ORDER BY d.deadline_date ASC, d.deadline_time ASC
                        """, countQuery = """
                        SELECT count(*) FROM design_orders d
                        WHERE
                            (:id IS NULL OR :id = '' OR CAST(d.id AS TEXT) LIKE CONCAT('%', :id, '%'))
                            AND (:folderName IS NULL OR :folderName = '' OR UPPER(d.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                            AND (:jobDetails IS NULL OR :jobDetails = '' OR UPPER(d.job_details) LIKE UPPER(CONCAT('%', :jobDetails, '%')))
                            AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(d.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                            AND (:assignee IS NULL OR :assignee = '' OR UPPER(d.assignee) LIKE UPPER(CONCAT('%', :assignee, '%')))
                            AND (:joId IS NULL OR :joId = '' OR UPPER(d.jo_id) LIKE UPPER(CONCAT('%', :joId, '%')) OR UPPER(d.qp_id) LIKE UPPER(CONCAT('%', :joId, '%')))
                            AND (:processStatus IS NULL OR :processStatus = '' OR d.process_status = :processStatus)
                            AND (:confirm IS NULL OR :confirm = '' OR d.confirm_status = :confirm)
                            AND (CAST(:startDate AS DATE) IS NULL OR d.order_date >= :startDate)
                            AND (CAST(:endDate AS DATE) IS NULL OR d.order_date <= :endDate)
                            AND (:hasRemarkAdd IS NULL OR (:hasRemarkAdd = true AND d.remark_add IS NOT NULL))
                            AND (:remarkStatus IS NULL OR :remarkStatus = '' OR d.remark_add = :remarkStatus)
                        """, nativeQuery = true)
        Page<DesignOrders> findByAllSorted(
                        @Param("id") String id,
                        @Param("folderName") String folderName,
                        @Param("jobDetails") String jobDetails,
                        @Param("jobOwner") String jobOwner,
                        @Param("assignee") String assignee,
                        @Param("joId") String joId,
                        @Param("processStatus") String processStatus,
                        @Param("confirm") String confirm,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("hasRemarkAdd") Boolean hasRemarkAdd,
                        @Param("remarkStatus") String remarkStatus,
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

        @Query(value = "select  count(id) as backlog from design_orders " +
                        "where assignee='รอผู้รับผิดชอบยืนยัน'", nativeQuery = true)
        Integer countBacklog();

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.process_status = 'รอดำเนินการ' " +
                        "and t.assignee = :assignee", nativeQuery = true)
        Integer countBacklogPending(@Param("assignee") String assignee);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.process_status = 'กำลังดำเนินการ' " +
                        "and t.assignee = :assignee", nativeQuery = true)
        Integer countBacklogInProgress(@Param("assignee") String assignee);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.confirm_status  = 'รอตรวจสอบ' and t.job_owner = :jobOwner", nativeQuery = true)
        Integer countBacklogCheck(@Param("jobOwner") String jobOwner);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.remark_add IS NOT NULL " +
                        "and t.remark_add != 'เพิ่มรายละเอียดแล้ว' " +
                        "and t.job_owner = :jobOwner", nativeQuery = true)
        Integer countRequestDetails(@Param("jobOwner") String jobOwner);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.remark_add = 'เพิ่มรายละเอียดแล้ว' " +
                        "and t.assignee = :assignee", nativeQuery = true)
        Integer countDetailsAdded(@Param("assignee") String assignee);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.confirm_status  = 'รอตรวจสอบ' " +
                        "and t.assignee = :assignee", nativeQuery = true)
        Integer countBacklogCheckDe(@Param("assignee") String assignee);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.process_status  = 'รอดำเนินการแก้ไข' " +
                        "and t.assignee = :assignee", nativeQuery = true)
        Integer countBacklogEdit(@Param("assignee") String assignee);

        @Query(value = "select count(t.id) from design_orders t " +
                        "where t.confirm_status  = 'ผ่าน' AND date_trunc('month', t.confirm_date) = date_trunc('month', CURRENT_DATE)", nativeQuery = true)
        Integer countBacklogComplete();

}