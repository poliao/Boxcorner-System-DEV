package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.LalamoveCloseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LalamoveCloseRequestRepository extends JpaRepository<LalamoveCloseRequest, Long> {
    Optional<LalamoveCloseRequest> findByJobNo(String jobNo);

    List<LalamoveCloseRequest> findByStatus(String status);
}
