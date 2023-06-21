package com.manati.squid.repository;

import com.manati.squid.domain.CatService;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CatService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CatServiceRepository extends JpaRepository<CatService, Long> {}
