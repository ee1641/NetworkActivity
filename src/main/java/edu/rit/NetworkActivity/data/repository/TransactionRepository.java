package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTxHash(String txHash);
    List<Transaction> findByBlockNumber(Long blockNumber);
    List<Transaction> findByFromAddress(String fromAddress);
    List<Transaction> findByToAddress(String toAddress);

    List<Transaction> findByTimestampBetween(OffsetDateTime start, OffsetDateTime end);
    List<Transaction> findByFromAddressAndTimestampBetween(String fromAddress, OffsetDateTime start, OffsetDateTime end);
    List<Transaction> findByToAddressAndTimestampBetween(String toAddress, OffsetDateTime start, OffsetDateTime end);
}