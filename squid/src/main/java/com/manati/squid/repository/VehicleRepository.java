package com.manati.squid.repository;

import com.manati.squid.domain.Vehicle;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Vehicle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("select vehicle from Vehicle vehicle where vehicle.user.login = ?#{principal.username}")
    List<Vehicle> findByUserIsCurrentUser();
}
