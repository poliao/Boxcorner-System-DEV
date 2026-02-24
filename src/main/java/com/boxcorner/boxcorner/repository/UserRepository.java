package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.User;
import com.boxcorner.boxcorner.entity.dto.OptionDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query(value = "SELECT u.username as value, u.username as text " +
            "FROM users u " +
            "WHERE u.role in ('planningTa','planningF','planningNick','planning')", nativeQuery = true)
    List<OptionDTO> findPlanningUsers();

    @Query(value = "SELECT u.username as value, u.username as text " +
            "FROM users u " +
            "WHERE LOWER(u.role) LIKE '%sales%'", nativeQuery = true)
    List<OptionDTO> findSalesUsers();
}