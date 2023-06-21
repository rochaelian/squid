package com.manati.squid.repository;

import com.manati.squid.domain.Catalog;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Catalog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CatalogRepository extends JpaRepository<Catalog, Long> {
    Optional<Catalog> findCatalogsByName(String name);
}
