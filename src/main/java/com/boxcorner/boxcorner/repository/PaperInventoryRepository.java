package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.PaperInventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaperInventoryRepository extends JpaRepository<PaperInventory, Long> {

  @Query(value = """
      SELECT pi.inventory_id, pi.unit_stock_id,
             pi.current_major_qty, pi.current_minor_qty,
             pi.warehouse_location, pi.last_updated, pi.row_version,
             us.item_name, us.category, us.paper_size,
             us.major_unit, us.minor_unit
      FROM paper_inventory pi
      LEFT JOIN unit_stock us ON us.id = pi.unit_stock_id
      WHERE (:itemName IS NULL OR :itemName = '' OR UPPER(us.item_name) LIKE UPPER(CONCAT('%', :itemName, '%')))
        AND (:category IS NULL OR :category = '' OR UPPER(us.category) LIKE UPPER(CONCAT('%', :category, '%')))
      ORDER BY pi.inventory_id DESC
      """, countQuery = """
      SELECT COUNT(*) FROM paper_inventory pi
      LEFT JOIN unit_stock us ON us.id = pi.unit_stock_id
      WHERE (:itemName IS NULL OR :itemName = '' OR UPPER(us.item_name) LIKE UPPER(CONCAT('%', :itemName, '%')))
        AND (:category IS NULL OR :category = '' OR UPPER(us.category) LIKE UPPER(CONCAT('%', :category, '%')))
      """, nativeQuery = true)
  Page<Object[]> findByFiltersRaw(
      @Param("itemName") String itemName,
      @Param("category") String category,
      Pageable pageable);

  @Query(value = """
      SELECT us.id, us.item_name, us.category, us.paper_size,
             pi.current_major_qty, pi.current_minor_qty,
             us.major_unit, us.minor_unit
      FROM unit_stock us
      LEFT JOIN paper_inventory pi ON pi.unit_stock_id = us.id
      WHERE (pi.current_major_qty > 0 OR pi.current_minor_qty > 0)
      ORDER BY us.item_name ASC
      """, nativeQuery = true)
  java.util.List<Object[]> findAllAvailableWithStockData();

  Optional<PaperInventory> findByUnitStockId(Long unitStockId);
}
