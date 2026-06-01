package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.HrEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HrEmployeeRepository extends JpaRepository<HrEmployee, Long> {
}
