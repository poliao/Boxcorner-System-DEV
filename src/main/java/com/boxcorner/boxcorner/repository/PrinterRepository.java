package com.boxcorner.boxcorner.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boxcorner.boxcorner.entity.BaseEntity.PrinterBrand;
import com.boxcorner.boxcorner.entity.Printer;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrinterRepository extends JpaRepository<Printer, Integer> {

    List<Printer> findByIsActiveTrue();

    List<Printer> findByBrandAndIsActiveTrue(PrinterBrand brand);

    @Override
    Optional<Printer> findById(Integer id);

    boolean existsByName(String name);
}