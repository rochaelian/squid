package com.manati.squid.repository;

import com.manati.squid.domain.Order;
import com.manati.squid.domain.ServiceOrder;
import com.manati.squid.domain.User;
import com.manati.squid.domain.UserDetails;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ServiceOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
    List<ServiceOrder> findServiceOrdersByOrder_Id(Long id);
    Optional<ServiceOrder> findServiceOrderByOrder_Id(Long id);
    Optional<ServiceOrder> findServiceOrderByOrderId(Long id);
}
