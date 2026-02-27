package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserId(UUID userId);
    List<AuditLog> findByActionType(String actionType);
}