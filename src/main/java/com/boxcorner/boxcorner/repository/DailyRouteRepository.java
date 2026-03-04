package com.boxcorner.boxcorner.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.DailyRoute;

@Repository
public interface DailyRouteRepository extends JpaRepository<DailyRoute, Long> {
    boolean existsByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);

    Optional<DailyRoute> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);

    @org.springframework.data.jpa.repository.Query("""
                SELECT d FROM DailyRoute d
                JOIN User u ON u.id = d.employeeId
                WHERE
                    (CAST(:startDate AS date) IS NULL OR d.workDate >= :startDate)
                    AND (CAST(:endDate AS date) IS NULL OR d.workDate <= :endDate)
                    AND (CAST(:salesName AS string) IS NULL OR :salesName = '' OR u.username = :salesName)
            """)
    java.util.List<DailyRoute> findByFiltersAdmin(
            @org.springframework.data.repository.query.Param("startDate") LocalDate startDate,
            @org.springframework.data.repository.query.Param("endDate") LocalDate endDate,
            @org.springframework.data.repository.query.Param("salesName") String salesName);

    @org.springframework.data.jpa.repository.Query("""
                SELECT d FROM DailyRoute d
                JOIN User u ON u.id = d.employeeId
                WHERE
                    (CAST(:startDate AS date) IS NULL OR d.workDate >= :startDate)
                    AND (CAST(:endDate AS date) IS NULL OR d.workDate <= :endDate)
                    AND (u.username = :salesName)
            """)
    java.util.List<DailyRoute> findByFilters(
            @org.springframework.data.repository.query.Param("startDate") LocalDate startDate,
            @org.springframework.data.repository.query.Param("endDate") LocalDate endDate,
            @org.springframework.data.repository.query.Param("salesName") String salesName);
}
