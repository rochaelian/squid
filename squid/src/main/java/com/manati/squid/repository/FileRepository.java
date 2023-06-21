package com.manati.squid.repository;

import com.manati.squid.domain.File;
import com.manati.squid.domain.ServiceOrder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the File entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findFilesByServiceOrder_Id(Long id);

    Optional<File> findFileByOrderId(Long id);
    List<File> findFilesByOrder_Id(Long id);
}
