package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTxHash(String txHash);
    List<Transaction> findByBlockNumber(Long blockNumber);
    List<Transaction> findByFromAddress(String fromAddress);
    List<Transaction> findByToAddress(String toAddress);
}