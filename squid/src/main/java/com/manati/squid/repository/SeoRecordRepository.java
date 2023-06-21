package com.manati.squid.repository;

import com.manati.squid.domain.SeoRecord;
import com.manati.squid.domain.enumeration.Status;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SeoRecord entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeoRecordRepository extends JpaRepository<SeoRecord, Long> {
    @Query("select s from SeoRecord s where s.status = :seoStatus")
    List<SeoRecord> findAllEnabledSeoRecord(@Param("seoStatus") Status seoStatus);

    List<SeoRecord> findAllByBusiness_Id(Long id);

    @Query("SELECT SUM(s.cost) FROM SeoRecord s")
    Integer getAllCost();
}
