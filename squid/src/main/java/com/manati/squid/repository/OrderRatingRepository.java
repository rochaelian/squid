package com.manati.squid.repository;

import com.manati.squid.domain.OrderRating;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrderRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRatingRepository extends JpaRepository<OrderRating, Long> {
    List<OrderRating> findAllByOrder_Id(Long id);

    Boolean existsOrderRatingByOrder_Id(Long aLong);
}
