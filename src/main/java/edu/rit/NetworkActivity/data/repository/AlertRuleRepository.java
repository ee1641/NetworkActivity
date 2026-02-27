package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.AlertRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlertRuleRepository extends JpaRepository<AlertRule, Long> {
    List<AlertRule> findByUserId(UUID userId);
}