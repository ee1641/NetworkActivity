package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.AlertHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertHistoryRepository extends JpaRepository<AlertHistory, Long> {
    List<AlertHistory> findByRuleId(Long ruleId);
}