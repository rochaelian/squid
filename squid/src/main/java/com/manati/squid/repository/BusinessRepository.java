package com.manati.squid.repository;

import com.manati.squid.domain.Business;
import com.manati.squid.domain.Catalog;
import com.manati.squid.domain.enumeration.Status;
import java.util.List;
import java.util.Optional;
import jdk.jfr.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Business entity.
 */
@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
    @Query("select business from Business business where business.owner.login = ?#{principal.username}")
    List<Business> findByOwnerIsCurrentUser();

    @Query("select business from Business business where business.owner.id = :id AND business.status = :businessStatus")
    List<Business> findByOwner(@Param("id") Long id, @Param("businessStatus") Status businessStatus);

    @Query(
        value = "select distinct business from Business business left join fetch business.catalogs",
        countQuery = "select count(distinct business) from Business business"
    )
    Page<Business> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct business from Business business left join fetch business.catalogs")
    List<Business> findAllWithEagerRelationships();

    @Query("select business from Business business left join fetch business.catalogs where business.id =:id")
    Optional<Business> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select business from Business business where business.status = :businessStatus")
    List<Business> findAllEnabledBusinesses(@Param("businessStatus") Status businessStatus);

    @Query("select business from Business business where business.category = :category")
    List<Business> findAllTallerBusinesses(@Param("category") String category);

    @Query("select distinct business.catalogs from Business business")
    List<Catalog> findAllInsuranceBusinesses();

    @Query("SELECT b FROM Business b ORDER BY b.rating DESC")
    List<Business> findBusinessTop1();
}
