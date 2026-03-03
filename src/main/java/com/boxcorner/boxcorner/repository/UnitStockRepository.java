package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.UnitStock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UnitStockRepository extends JpaRepository<UnitStock, Long> {

  @Query(value = """
      SELECT * FROM unit_stock p
      WHERE (:itemName IS NULL OR :itemName = '' OR UPPER(p.item_name) LIKE UPPER(CONCAT('%', :itemName, '%')))
        AND (:category IS NULL OR :category = '' OR UPPER(p.category) LIKE UPPER(CONCAT('%', :category, '%')))
        AND (:paperSize IS NULL OR :paperSize = '' OR UPPER(p.paper_size) LIKE UPPER(CONCAT('%', :paperSize, '%')))
      ORDER BY p.id DESC
      """, countQuery = """
      SELECT COUNT(*) FROM unit_stock p
      WHERE (:itemName IS NULL OR :itemName = '' OR UPPER(p.item_name) LIKE UPPER(CONCAT('%', :itemName, '%')))
        AND (:category IS NULL OR :category = '' OR UPPER(p.category) LIKE UPPER(CONCAT('%', :category, '%')))
        AND (:paperSize IS NULL OR :paperSize = '' OR UPPER(p.paper_size) LIKE UPPER(CONCAT('%', :paperSize, '%')))
      """, nativeQuery = true)
  Page<UnitStock> findByFilters(
      @Param("itemName") String itemName,
      @Param("category") String category,
      @Param("paperSize") String paperSize,
      Pageable pageable);

  @Query(value = """
      SELECT DISTINCT us.* 
      FROM unit_stock us
      JOIN paper_inventory pi ON pi.unit_stock_id = us.id
      WHERE (pi.current_major_qty > 0 OR pi.current_minor_qty > 0)
      ORDER BY us.item_name ASC
      """, nativeQuery = true)
  java.util.List<UnitStock> findAllWithPositiveInventory();
}
