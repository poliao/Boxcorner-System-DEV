package com.boxcorner.boxcorner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boxcorner.boxcorner.entity.Quotation;

import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    List<Quotation> findByActivityIdOrderByRevisionDesc(Long activityId);

    @Query("SELECT q FROM Quotation q WHERE q.activityId = :activityId AND q.isCurrent = true")
    Optional<Quotation> findCurrentByActivityId(@Param("activityId") Long activityId);

    @Query("SELECT COUNT(q) FROM Quotation q WHERE q.activityId = :activityId")
    Integer countByActivityId(@Param("activityId") Long activityId);
}
