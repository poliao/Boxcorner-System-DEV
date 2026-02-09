package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boxcorner.boxcorner.entity.SampleOrder;

public interface SampleOrderRepository extends JpaRepository<SampleOrder, Integer> {

    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (s.status != 'ยกเลิก')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.id DESC
            """, countQuery = "SELECT count(*) FROM sample_orders s", nativeQuery = true)
    Page<SampleOrder> findByFilters(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (s.status != 'ยกเลิก')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.delivery_date ASC, s.delivery_time ASC
            """, countQuery = "SELECT count(*) FROM sample_orders s", nativeQuery = true)
    Page<SampleOrder> findByFiltersSort(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.id desc
            """, countQuery = "SELECT count(*) FROM sample_orders s", nativeQuery = true)
    Page<SampleOrder> findByFiltersDetail(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.delivery_date asc , s.delivery_time asc
            """, countQuery = "SELECT count(*) FROM sample_orders s", nativeQuery = true)
    Page<SampleOrder> findByFiltersDetailSort(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

        @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (s.status != 'ยกเลิก')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.id desc
            """, countQuery = "SELECT count(*) FROM sample_orders s", nativeQuery = true)
    Page<SampleOrder> findByFiltersDetailBack(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

        @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                (s.status != 'ยกเลิก')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.delivery_date asc , s.delivery_time asc
            """, countQuery = "SELECT count(*) FROM sample_orders s", nativeQuery = true)
    Page<SampleOrder> findByFiltersDetailBackSort(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT count(id)
            FROM sample_orders so
            WHERE so.status = :status
            AND (:responsiblePerson IS NULL OR so.responsible_person = :responsiblePerson);
            """, nativeQuery = true)
    Integer countBacklogStatus(@Param("status") String status, @Param("responsiblePerson") String responsiblePerson);

    @Query(value = """
            SELECT count(id)
            FROM sample_orders so
            WHERE so.status = :status;
            """, nativeQuery = true)
    Integer countStatus(@Param("status") String status);

    @Query(value = """
            SELECT count(id)
            FROM sample_orders so
            WHERE so.status = :status
            AND (:jobOwner IS NULL OR so.job_owner = :jobOwner);
            """, nativeQuery = true)
    Integer countBacklogSalesStatus(@Param("status") String status, @Param("jobOwner") String jobOwner);

    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                s.status IN ('ไฟล์เสร็จ รอตรวจสอบไฟล์', 'แก้ไขไฟล์', 'สำเร็จ รออนุมัติไปตารางรอผลิต','ไฟล์ถูกต้อง รอขึ้นตัวอย่าง', 'ผ่าน', 'ขึ้นตัวอย่างแล้ว','ไฟล์Proofเสร็จ รอตรวจ','ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.id DESC
            """, countQuery = """
            SELECT count(*) FROM sample_orders s
            WHERE
                s.status IN ('ไฟล์เสร็จ รอตรวจสอบไฟล์', 'แก้ไขไฟล์', 'สำเร็จ รออนุมัติไปตารางรอผลิต', 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง', 'ผ่าน', 'ขึ้นตัวอย่างแล้ว','ไฟล์Proofเสร็จ รอตรวจ','ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            """, nativeQuery = true)
    Page<SampleOrder> findByFiltersVerify(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Query(value = """
            SELECT * FROM sample_orders s
            WHERE
                s.status IN ('ไฟล์เสร็จ รอตรวจสอบไฟล์', 'แก้ไขไฟล์', 'สำเร็จ รออนุมัติไปตารางรอผลิต','ไฟล์ถูกต้อง รอขึ้นตัวอย่าง', 'ผ่าน', 'ขึ้นตัวอย่างแล้ว','ไฟล์Proofเสร็จ รอตรวจ','ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            ORDER BY s.delivery_date asc , s.delivery_time asc
            """, countQuery = """
            SELECT count(*) FROM sample_orders s
            WHERE
                s.status IN ('ไฟล์เสร็จ รอตรวจสอบไฟล์', 'แก้ไขไฟล์', 'สำเร็จ รออนุมัติไปตารางรอผลิต', 'ไฟล์ถูกต้อง รอขึ้นตัวอย่าง', 'ผ่าน', 'ขึ้นตัวอย่างแล้ว','ไฟล์Proofเสร็จ รอตรวจ','ไฟล์Proofถูกต้อง รอส่งไปช่างพิมพ์')
                AND (:id IS NULL OR s.id = :id)
                AND (:folderName IS NULL OR :folderName = '' OR UPPER(s.folder_name) LIKE UPPER(CONCAT('%', :folderName, '%')))
                AND (:jobOwner IS NULL OR :jobOwner = '' OR UPPER(s.job_owner) LIKE UPPER(CONCAT('%', :jobOwner, '%')))
                AND (:responsiblePerson IS NULL OR :responsiblePerson = '' OR UPPER(s.responsible_person) LIKE UPPER(CONCAT('%', :responsiblePerson, '%')))
                AND (:status IS NULL OR :status = '' OR UPPER(s.status) LIKE UPPER(CONCAT('%', :status, '%')))
                AND (CAST(:startDate AS DATE) IS NULL OR s.order_date >= :startDate)
                AND (CAST(:endDate AS DATE) IS NULL OR s.order_date <= :endDate)
            """, nativeQuery = true)
    Page<SampleOrder> findByFiltersVerifySort(
            @Param("id") Integer id,
            @Param("folderName") String folderName,
            @Param("jobOwner") String jobOwner,
            @Param("responsiblePerson") String responsiblePerson,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

}
