package com.boxcorner.boxcorner.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.UsersQc;
import com.boxcorner.boxcorner.entity.dto.OptionDTO;

@Repository
public interface UserQcRepository extends JpaRepository<UsersQc, Long> {

    @Query(value = """
            SELECT uq.name as text,
            uq.name as value
            FROM users_qc uq
            WHERE uq.department = :department
            ORDER BY uq.id ASC
            """, nativeQuery = true)
    List<OptionDTO> getNameQc(@Param("department") String department);

    @Query(value = """
            SELECT uq.name as text,
            uq.name as value
            FROM users_qc uq
            ORDER BY uq.id ASC
            """, nativeQuery = true)
    List<OptionDTO> getAllName();

}
