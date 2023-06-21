package com.manati.squid.repository;

import com.manati.squid.domain.Transaction;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Transaction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("select transaction from Transaction transaction where transaction.source.login = ?#{principal.username}")
    List<Transaction> findBySourceIsCurrentUser();
}
