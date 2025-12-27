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
                   "FROM uat.users u " +
                   "WHERE u.role = 'planning'", 
           nativeQuery = true)
    List<OptionDTO> findPlanningUsers();
}