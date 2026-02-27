package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByContractAddress(String contractAddress);
    List<Token> findBySymbol(String symbol);
}