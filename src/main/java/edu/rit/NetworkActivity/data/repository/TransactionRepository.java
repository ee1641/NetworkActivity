package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTxHash(String txHash);

    List<Transaction> findByBlockNumber(Long blockNumber);

    List<Transaction> findByFromAddress(String fromAddress);

    List<Transaction> findByToAddress(String toAddress);

    List<Transaction> findByTimestampBetween(OffsetDateTime start, OffsetDateTime end);

    List<Transaction> findByFromAddressAndTimestampBetween(String fromAddress, OffsetDateTime start,
            OffsetDateTime end);

    List<Transaction> findByToAddressAndTimestampBetween(String toAddress, OffsetDateTime start, OffsetDateTime end);

    List<Transaction> findByValueGreaterThanEqualAndTimestampBetween(Float minValue, OffsetDateTime start,
            OffsetDateTime end);

    @Query("SELECT MAX(t.blockNumber) FROM Transaction t")
    Optional<Long> findMaxBlockNumber();

    @Query("SELECT t.toAddress, COUNT(t), SUM(t.value) FROM Transaction t " +
           "WHERE t.timestamp BETWEEN :start AND :end AND t.toAddress IS NOT NULL " +
           "GROUP BY t.toAddress")
    List<Object[]> groupByReceiverBetween(@Param("start") OffsetDateTime start,
                                          @Param("end") OffsetDateTime end);

    @Query("SELECT t.toAddress, COUNT(t) FROM Transaction t " +
           "WHERE t.timestamp BETWEEN :start AND :end AND t.toAddress IS NOT NULL " +
           "GROUP BY t.toAddress")
    List<Object[]> countByReceiverBetween(@Param("start") OffsetDateTime start,
                                          @Param("end") OffsetDateTime end);

    @Query(value = "SELECT date_trunc('hour', timestamp) as hr, COUNT(*) as count " +
                   "FROM transactions " +
                   "WHERE timestamp BETWEEN :start AND :end " +
                   "GROUP BY hr ORDER BY hr ASC", nativeQuery = true)
    List<Object[]> getVolumeByHour(@Param("start") OffsetDateTime start,
                                   @Param("end") OffsetDateTime end);
}