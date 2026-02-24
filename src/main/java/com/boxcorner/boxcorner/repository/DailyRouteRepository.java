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
}
