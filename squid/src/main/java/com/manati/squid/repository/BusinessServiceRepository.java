package com.manati.squid.repository;

import com.manati.squid.domain.BusinessService;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BusinessService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessServiceRepository extends JpaRepository<BusinessService, Long> {
    List<BusinessService> findAllByServiceId(Long id);
    List<BusinessService> findBusinessServicesByBusiness_Id(Long id);
}
