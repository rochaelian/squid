package com.manati.squid.repository;

import com.manati.squid.domain.APP;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the APP entity.
 */
@SuppressWarnings("unused")
@Repository
public interface APPRepository extends JpaRepository<APP, Long> {}
