package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.ProductionOrder;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Integer> {

    @Query(value = """
            SELECT * FROM production_orders p
            WHERE
                (:id IS NULL OR p.id = :id)
                AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                AND (:postpone IS NULL OR :postpone = '' OR p.postpone = :postpone)
            ORDER BY p.id DESC
            """, countQuery = """
            SELECT count(*) FROM production_orders p
            WHERE
                (:id IS NULL OR p.id = :id)
                AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                AND (:postpone IS NULL OR :postpone = '' OR p.postpone = :postpone)
            """, nativeQuery = true)
    Page<ProductionOrder> findByFilters(
            @Param("id") Integer id,
            @Param("jobId") String jobId,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            @Param("postpone") String postpone,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM production_orders p
            WHERE
                (:id IS NULL OR p.id = :id)
                AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                AND (:postpone IS NULL OR :postpone = '' OR p.postpone = :postpone)
            ORDER BY p.delivery_date asc
            """, countQuery = """
            SELECT count(*) FROM production_orders p
            WHERE
                (:id IS NULL OR p.id = :id)
                AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                AND (:postpone IS NULL OR :postpone = '' OR p.postpone = :postpone)
            """, nativeQuery = true)
    Page<ProductionOrder> findByFiltersSort(
            @Param("id") Integer id,
            @Param("jobId") String jobId,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            @Param("postpone") String postpone,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM production_orders p
            WHERE
                (p.job_status != 'ยกเลิก')
                AND (p.process_status != 'ยกเลิก')
                AND (p.operator_name != 'ยกเลิก')
                AND (:id IS NULL OR p.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) = UPPER(:operatorName))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
            ORDER BY p.id DESC
            """, countQuery = """
            SELECT count(*) FROM production_orders p
            WHERE
                (p.job_status != 'ยกเลิก')
                AND (p.process_status != 'ยกเลิก')
                AND (p.operator_name != 'ยกเลิก')
                AND (:id IS NULL OR p.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
            """, nativeQuery = true)
    Page<ProductionOrder> findByProductionFilters(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM production_orders p
            WHERE
                (p.job_status != 'ยกเลิก')
                AND (p.process_status != 'ยกเลิก')
                AND (p.operator_name != 'ยกเลิก')
                AND (:id IS NULL OR p.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) = UPPER(:operatorName))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
            ORDER BY p.delivery_date asc
            """, countQuery = """
            SELECT count(*) FROM production_orders p
            WHERE
                (p.job_status != 'ยกเลิก')
                AND (p.process_status != 'ยกเลิก')
                AND (p.operator_name != 'ยกเลิก')
                AND (:id IS NULL OR p.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
            """, nativeQuery = true)
    Page<ProductionOrder> findByProductionFiltersSort(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            Pageable pageable);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.operator_name = :operatorName and po.process_status = 'รอดำเนินการ'", nativeQuery = true)
    Integer countBacklog(@Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.operator_name = 'รอผู้รับผิดชอบยืนยัน'", nativeQuery = true)
    Integer countBacklogHPlanning();

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = 'เสร็จสิ้น รอตรวจสอบ'", nativeQuery = true)
    Integer countBacklogCheck();

    @Query(value = "SELECT * FROM production_orders p " +
            "WHERE (p.job_status != 'ยกเลิก') " +
            "AND (p.process_status != 'ยกเลิก') " +
            "AND (p.operator_name != 'ยกเลิก') " +
            "AND (:id IS NULL OR p.id = :id) " +
            "AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%'))) "
            +
            "AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%'))) " +
            "AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate) " +
            "AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate) " +
            "AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime) " +
            "AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%'))) "
            +
            "AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%'))) "
            +
            "AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%'))) "
            +
            "AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%'))) "
            +
            "AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%'))) " +
            "AND (p.process_status NOT IN ('รอดำเนินการ', 'รอผู้รับผิดชอบยืนยัน', 'กำลังดำเนินการ'))" +
            "AND (:inspector IS NULL OR :inspector = '' OR UPPER(p.inspector) LIKE UPPER(CONCAT('%', :inspector, '%')))" +
            "AND (:dalivery IS NULL OR (p.data_dalivery = :dalivery AND (p.process_status = 'ส่งไฟล์แล้ว' OR p.process_status = 'เสร็จสิ้น')))" +
            "ORDER BY p.id DESC", countQuery = "SELECT count(*) FROM production_orders p " +
                    "WHERE (p.job_status != 'ยกเลิก') " +
                    "AND (p.process_status != 'ยกเลิก') " +
                    "AND (p.operator_name != 'ยกเลิก') " +
                    "AND (:id IS NULL OR p.id = :id) " +
                    "AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%'))) "
                    +
                    "AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%'))) "
                    +
                    "AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate) " +
                    "AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate) " +
                    "AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime) " +
                    "AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%'))) "
                    +
                    "AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%'))) "
                    +
                    "AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%'))) "
                    +
                    "AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%'))) "
                    +
                    "AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))"
                    +
                    "AND (:inspector IS NULL OR :inspector = '' OR UPPER(p.inspector) LIKE UPPER(CONCAT('%', :inspector, '%')))"
                    +
                    "AND (:dalivery IS NULL OR (p.data_dalivery = :dalivery AND (p.process_status = 'ส่งไฟล์แล้ว' OR p.process_status = 'เสร็จสิ้น')))"
                    +
                    "AND (p.process_status NOT IN ('รอดำเนินการ', 'รอผู้รับผิดชอบยืนยัน', 'กำลังดำเนินการ','รับของจากซัพพลายเออร์แล้ว','ส่ง Supplier'))",  nativeQuery = true)
    Page<ProductionOrder> findProductionCheck(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            @Param("inspector") String inspector,
            @Param("dalivery") Boolean dalivery,
            Pageable pageable);

    @Query(value = "SELECT * FROM production_orders p " +
            "WHERE (p.job_status != 'ยกเลิก') " +
            "AND (p.process_status != 'ยกเลิก') " +
            "AND (p.operator_name != 'ยกเลิก') " +
            "AND (:id IS NULL OR p.id = :id) " +
            "AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%'))) "
            +
            "AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%'))) " +
            "AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate) " +
            "AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate) " +
            "AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime) " +
            "AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%'))) "
            +
            "AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%'))) "
            +
            "AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%'))) "
            +
            "AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%'))) "
            +
            "AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%'))) " +
            "AND (p.process_status NOT IN ('รอดำเนินการ', 'รอผู้รับผิดชอบยืนยัน', 'กำลังดำเนินการ'))" +
            "AND (:inspector IS NULL OR :inspector = '' OR UPPER(p.inspector) LIKE UPPER(CONCAT('%', :inspector, '%')))"
            +
            "ORDER BY p.delivery_date asc", countQuery = "SELECT count(*) FROM production_orders p " +
                    "WHERE (p.job_status != 'ยกเลิก') " +
                    "AND (p.process_status != 'ยกเลิก') " +
                    "AND (p.operator_name != 'ยกเลิก') " +
                    "AND (:id IS NULL OR p.id = :id) " +
                    "AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%'))) "
                    +
                    "AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%'))) "
                    +
                    "AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate) " +
                    "AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate) " +
                    "AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime) " +
                    "AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%'))) "
                    +
                    "AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%'))) "
                    +
                    "AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%'))) "
                    +
                    "AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%'))) "
                    +
                    "AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))"
                    +
                    "AND (:inspector IS NULL OR :inspector = '' OR UPPER(p.inspector) LIKE UPPER(CONCAT('%', :inspector, '%')))"
                    +
                    "AND (p.process_status NOT IN ('รอดำเนินการ', 'รอผู้รับผิดชอบยืนยัน', 'กำลังดำเนินการ','รับของจากซัพพลายเออร์แล้ว','ส่ง Supplier'))", nativeQuery = true)
    Page<ProductionOrder> findProductionCheckSort(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            @Param("inspector") String inspector,
            Pageable pageable);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.job_status = 'เสร็จสิ้น' and po.process_status = 'ส่งไฟล์แล้ว' and po.mold_status = 'รอดำเนินการ'  and po.job_type = 'OS'", nativeQuery = true)
    Integer countBacklogMold();

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = :processStatus and operator_name = :operatorName", nativeQuery = true)
    Integer countBacklogProcessStatus(@Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = :processStatus", nativeQuery = true)
    Integer countBacklogProcessStatus(@Param("processStatus") String processStatus);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where (po.data_dalivery = false or po.data_dalivery is null) " +
            "and (po.process_status = 'ส่งไฟล์แล้ว' or po.process_status = 'เสร็จสิ้น')", nativeQuery = true)
    Integer countBacklogDelivery();

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.mold_status = :moldStatus", nativeQuery = true)
    Integer countBacklogMoldStatus(@Param("moldStatus") String moldStatus);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = 'กำลังดำเนินการ' "+
            "and po.job_type = 'Supplier' "+
            "and po.operator_name = :operatorName", nativeQuery = true)
    Integer countBacklogSupplier(@Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = 'ส่ง Supplier' "+
            "and po.job_type = 'Supplier' "+
            "and po.operator_name = :operatorName", nativeQuery = true)
    Integer countBacklogKeepSupplier(@Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po " +
            "where po.postpone = 'มีการเลื่อนเวลาส่ง' "+
            "and po.job_owner = :jobOwner", nativeQuery = true)
    Integer countBacklogPostpone(@Param("jobOwner") String jobOwner);

    @Query(value = "select count(id) as backlog from production_orders po " +
            "where po.process_status = 'ส่งไฟล์แล้ว' "+
            "and po.job_status = 'เสร็จสิ้น' "+
            "and po.job_type = 'OD' "+
            "and printing_machine is null", nativeQuery = true)
    Integer countBacklogMachine();


    @Query(value = """
            SELECT * FROM production_orders p
            WHERE
                (p.job_status = 'เสร็จสิ้น')
                AND (p.process_status = 'ส่งไฟล์แล้ว')
                AND (:id IS NULL OR p.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                AND (:postpone IS NULL OR :postpone = '' OR p.postpone = :postpone)
                AND (p.printing_machine IS NULL)
            ORDER BY p.id DESC
            """, countQuery = """
            SELECT count(*) FROM production_orders p
            WHERE
                (p.job_status = 'เสร็จสิ้น')
                AND (p.process_status = 'ส่งไฟล์แล้ว')
                AND (:id IS NULL OR p.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(p.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR p.deadline_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR p.deadline_date <= :endDate)
                AND (CAST(:deadlineTime AS time) IS NULL OR p.deadline_time = :deadlineTime)
                AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                AND (:jobType IS NULL OR :jobType = '' OR UPPER(p.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                AND (:postpone IS NULL OR :postpone = '' OR p.postpone = :postpone)
                AND (p.printing_machine IS NULL)
            """, nativeQuery = true)
    Page<ProductionOrder> findByFiltersSample(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("deadlineTime") LocalTime deadlineTime,
            @Param("jobStatus") String jobStatus,
            @Param("processStatus") String processStatus,
            @Param("operatorName") String operatorName,
            @Param("moldStatus") String moldStatus,
            @Param("jobType") String jobType,
            @Param("postpone") String postpone,
            Pageable pageable);

}