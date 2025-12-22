package com.boxcorner.boxcorner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.Colors;

@Repository
public interface ColorsRepository extends JpaRepository<Colors, String> {
    void deleteByRecipeid(String recipeid);
    
    @Query("SELECT c.colorid FROM Colors c WHERE c.colorid LIKE 'COL%' ORDER BY c.colorid DESC LIMIT 1")
    String findTopByOrderByColoridDesc();

    List<Colors> findByRecipeid(String recipeid);
}