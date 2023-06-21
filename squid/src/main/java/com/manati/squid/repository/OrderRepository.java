package com.manati.squid.repository;

import com.manati.squid.domain.*;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select jhiOrder from Order jhiOrder where jhiOrder.operator.login = ?#{principal.username}")
    List<Order> findByOperatorIsCurrentUser();

    List<Order> findOrderByVehicle_Id(Long id);

    @Query("SELECT SUM(m.comission * m.totalCost) FROM Order m")
    Integer getComissionTotal();

    @Query("SELECT o.vehicle.brand.name FROM Order o GROUP BY o.vehicle.brand.name ORDER BY COUNT(o) DESC")
    List<String> getVehiclesOrderBrandName();

    @Query("SELECT COUNT(o) FROM Order o GROUP BY o.vehicle.brand.name ORDER BY COUNT(o) DESC")
    List<String> getVehiclesOrderBrandCount();

    @Query("SELECT COUNT(o) FROM Order o")
    int getOrdersCount();

    List<Order> findOrdersByBusinessId(Long id);

    List<Order> findOrdersByOperatorId(Long id);

    List<Order> findOrdersByVehicleId(Long id);
    //    List<Order> findOrdersByBusinessIdAAndOperatorId(int idBusiness, int idOperator);

    List<Order> findOrdersByStatusId(Long id);

    //  @Query("select jhiOrder from Order jhiOrder where jhiOrder.business.id =: idBusiness and jhiOrder.operator.id =: idOperator")
    // List<Order> findOrdersByBusinessIdAAndOperatorId(int idBusiness, int idOperator);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status.name = :status")
    int getOrdersCountByStatus(@Param("status") String status);
}
