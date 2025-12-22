package com.boxcorner.boxcorner.repository;

import com.boxcorner.boxcorner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // สั่งหา User จากชื่อ username
    Optional<User> findByUsername(String username);
}