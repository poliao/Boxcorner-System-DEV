package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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
                (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸')
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
                (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸')
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
                (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸')
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
                (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸')
                AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸')
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
            "where po.operator_name = :operatorName and po.process_status = 'à¸£à¸­à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£'", nativeQuery = true)
    Integer countBacklog(@Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.operator_name = 'à¸£à¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸¢à¸·à¸™à¸¢à¸±à¸™'", nativeQuery = true)
    Integer countBacklogHPlanning();

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™ à¸£à¸­à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸š'", nativeQuery = true)
    Integer countBacklogCheck();

    @Query(value = "SELECT * FROM production_orders p " +
            "WHERE (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
            "AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
            "AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
            "AND (:id IS NULL OR p.id = :id) " +
            "AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%'))) " +
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
            "AND (p.process_status NOT IN ('à¸£à¸­à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£', 'à¸£à¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸¢à¸·à¸™à¸¢à¸±à¸™', 'à¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£'))" +
            "AND (:inspector IS NULL OR :inspector = '' OR UPPER(p.inspector) LIKE UPPER(CONCAT('%', :inspector, '%')))" +
            "AND (:dalivery IS NULL OR (p.data_dalivery = :dalivery AND (p.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§' OR p.process_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™')))" +
            "ORDER BY p.id DESC", countQuery = "SELECT count(*) FROM production_orders p " +
                    "WHERE (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
                    "AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
                    "AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
                    "AND (:id IS NULL OR p.id = :id) " +
                    "AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%'))) " +
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
                    "AND (:dalivery IS NULL OR (p.data_dalivery = :dalivery AND (p.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§' OR p.process_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™')))"
                    +
                    "AND (p.process_status NOT IN ('à¸£à¸­à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£', 'à¸£à¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸¢à¸·à¸™à¸¢à¸±à¸™', 'à¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£','à¸£à¸±à¸šà¸‚à¸­à¸‡à¸ˆà¸²à¸à¸‹à¸±à¸žà¸žà¸¥à¸²à¸¢à¹€à¸­à¸­à¸£à¹Œà¹à¸¥à¹‰à¸§','à¸ªà¹ˆà¸‡ Supplier'))", nativeQuery = true)
    Page<ProductionOrder> findProductionCheck(
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
            @Param("inspector") String inspector,
            @Param("dalivery") Boolean dalivery,
            Pageable pageable);

    @Query(value = "SELECT * FROM production_orders p " +
            "WHERE (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
            "AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
            "AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
            "AND (:id IS NULL OR p.id = :id) " +
            "AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%'))) " +
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
            "AND (p.process_status NOT IN ('à¸£à¸­à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£', 'à¸£à¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸¢à¸·à¸™à¸¢à¸±à¸™', 'à¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£'))" +
            "AND (:inspector IS NULL OR :inspector = '' OR UPPER(p.inspector) LIKE UPPER(CONCAT('%', :inspector, '%')))"
            +
            "ORDER BY p.delivery_date asc", countQuery = "SELECT count(*) FROM production_orders p " +
                    "WHERE (p.job_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
                    "AND (p.process_status != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
                    "AND (p.operator_name != 'à¸¢à¸à¹€à¸¥à¸´à¸') " +
                    "AND (:id IS NULL OR p.id = :id) " +
                    "AND (:jobId IS NULL OR :jobId = '' OR UPPER(p.job_id) LIKE UPPER(CONCAT('%', :jobId, '%'))) " +
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
                    "AND (p.process_status NOT IN ('à¸£à¸­à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£', 'à¸£à¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸¢à¸·à¸™à¸¢à¸±à¸™', 'à¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£','à¸£à¸±à¸šà¸‚à¸­à¸‡à¸ˆà¸²à¸à¸‹à¸±à¸žà¸žà¸¥à¸²à¸¢à¹€à¸­à¸­à¸£à¹Œà¹à¸¥à¹‰à¸§','à¸ªà¹ˆà¸‡ Supplier'))", nativeQuery = true)
    Page<ProductionOrder> findProductionCheckSort(
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
            @Param("inspector") String inspector,
            Pageable pageable);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.job_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™' and po.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§' and po.mold_status = 'à¸£à¸­à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£'  and po.job_type = 'OS'", nativeQuery = true)
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
            "and (po.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§' or po.process_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™')", nativeQuery = true)
    Integer countBacklogDelivery();

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.mold_status = :moldStatus", nativeQuery = true)
    Integer countBacklogMoldStatus(@Param("moldStatus") String moldStatus);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = 'à¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£' " +
            "and po.job_type = 'Supplier' " +
            "and po.operator_name = :operatorName", nativeQuery = true)
    Integer countBacklogSupplier(@Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po  " +
            "where po.process_status = 'à¸ªà¹ˆà¸‡ Supplier' " +
            "and po.job_type = 'Supplier' " +
            "and po.operator_name = :operatorName", nativeQuery = true)
    Integer countBacklogKeepSupplier(@Param("operatorName") String operatorName);

    @Query(value = "select count(id) as backlog from production_orders po " +
            "where po.postpone = 'à¸¡à¸µà¸à¸²à¸£à¹€à¸¥à¸·à¹ˆà¸­à¸™à¹€à¸§à¸¥à¸²à¸ªà¹ˆà¸‡' " +
            "and po.job_owner = :jobOwner", nativeQuery = true)
    Integer countBacklogPostpone(@Param("jobOwner") String jobOwner);

    @Query(value = "select count(id) as backlog from production_orders po " +
            "where po.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§' " +
            "and po.job_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™' " +
            "and po.job_type = 'OD' " +
            "and printing_machine is null", nativeQuery = true)
    Integer countBacklogMachine();

    @Query(value = """
            SELECT * FROM production_orders p
            WHERE
                (p.job_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™')
                AND (p.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§')
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
                (p.job_status = 'à¹€à¸ªà¸£à¹‡à¸ˆà¸ªà¸´à¹‰à¸™')
                AND (p.process_status = 'à¸ªà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¹à¸¥à¹‰à¸§')
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

    @Query(value = """
            SELECT p.* FROM production_orders p
            WHERE p.id IN (
                SELECT MAX(p2.id) FROM production_orders p2
                WHERE
                    (:id IS NULL OR p2.id = :id)
                    AND (:jobId IS NULL OR :jobId = '' OR UPPER(p2.job_id) LIKE UPPER(CONCAT('%', :jobId, '%')))
                    AND (:folderName IS NULL OR :folderName = '' OR UPPER(p2.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                    AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(p2.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                    AND (CAST(:startDate AS DATE) IS NULL OR p2.deadline_date >= :startDate)
                    AND (CAST(:endDate AS DATE) IS NULL OR p2.deadline_date <= :endDate)
                    AND (CAST(:deadlineTime AS time) IS NULL OR p2.deadline_time = :deadlineTime)
                    AND (:jobStatus IS NULL OR :jobStatus = '' OR UPPER(p2.job_status) LIKE UPPER(CONCAT('%', :jobStatus, '%')))
                    AND (:processStatus IS NULL OR :processStatus = '' OR UPPER(p2.process_status) LIKE UPPER(CONCAT('%', :processStatus, '%')))
                    AND (:operatorName IS NULL OR :operatorName = '' OR UPPER(p2.operator_name) LIKE UPPER(CONCAT('%', :operatorName, '%')))
                    AND (:moldStatus IS NULL OR :moldStatus = '' OR UPPER(p2.mold_status) LIKE UPPER(CONCAT('%', :moldStatus, '%')))
                    AND (:jobType IS NULL OR :jobType = '' OR UPPER(p2.job_type) LIKE UPPER(CONCAT('%', :jobType, '%')))
                    AND (:postpone IS NULL OR :postpone = '' OR p2.postpone = :postpone)
                GROUP BY p2.job_id
            )
            """, countQuery = """
            SELECT count(DISTINCT p.job_id) FROM production_orders p
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
    Page<ProductionOrder> findLatestByFilters(
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

    List<ProductionOrder> findByJobIdOrderByIdDesc(String jobId);


    long countByJobId(String jobId);
}
