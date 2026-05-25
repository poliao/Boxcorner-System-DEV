package com.boxcorner.boxcorner.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.FoodOrderSession;
import com.boxcorner.boxcorner.entity.FoodOrderSession.FoodOrderStatus;

@Repository
public interface FoodOrderSessionRepository extends JpaRepository<FoodOrderSession, Long> {

    Optional<FoodOrderSession> findFirstByOrderByCreatedAtDesc();

    Optional<FoodOrderSession> findFirstByStatusOrderByCreatedAtDesc(FoodOrderStatus status);
}
