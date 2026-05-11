package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.LalamoveWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LalamoveWalletRepository extends JpaRepository<LalamoveWallet, Long> {

    List<LalamoveWallet> findByJobNo(String jobNo);

    @Modifying
    @Query("UPDATE LalamoveWallet w SET w.jobStatus = :status WHERE w.jobNo = :jobNo AND w.type = 'expense'")
    int updateJobStatusByJobNo(@Param("jobNo") String jobNo, @Param("status") String status);
}
