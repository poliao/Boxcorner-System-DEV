package com.boxcorner.boxcorner.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.boxcorner.boxcorner.entity.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, String> {

    @Query(value = "SELECT r.recipeid FROM recipe r WHERE r.recipeid LIKE 'BCA%' ORDER BY r.recipeid DESC LIMIT 1", nativeQuery = true)
    String findTopByOrderByRecipeidDesc();

    @Query("""
                SELECT r
                FROM Recipe r
                WHERE
                  (:jobname IS NULL OR :jobname = '' OR UPPER(r.jobname) LIKE CONCAT('%', UPPER(:jobname), '%'))
                  AND (:jobid IS NULL OR :jobid = '' OR UPPER(r.jobid) LIKE CONCAT('%', UPPER(:jobid), '%'))
                  AND (:recipeid IS NULL OR :recipeid = '' OR UPPER(r.recipeid) LIKE CONCAT('%', UPPER(:recipeid), '%'))
            """)
    Page<Recipe> findByFilters(
            @Param("recipeid") String recipeid,
            @Param("jobid") String jobid,
            @Param("jobname") String jobname,
            Pageable pageable);

    @Query(value = "SELECT DISTINCT r.recipeid FROM Recipe r " +
            "WHERE (:query IS NULL OR  UPPER(r.recipeid) LIKE CONCAT('%', UPPER(:query), '%')) " +
            "ORDER BY r.recipeid ASC " +
            "LIMIT 20", nativeQuery = true)
    List<String> findUniqueRecipeIds(@Param("query") String query);

    @Query(value = "SELECT DISTINCT r.jobid FROM Recipe r " +
            "WHERE (:query = '' OR UPPER(r.jobid) LIKE CONCAT('%', UPPER(:query), '%')) " +
            "ORDER BY r.jobid ASC LIMIT 20", nativeQuery = true)
    List<String> findUniqueJobIds(@Param("query") String query);
}
