package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByBlockNumber(Long blockNumber);
}