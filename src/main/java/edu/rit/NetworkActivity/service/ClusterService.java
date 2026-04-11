package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Cluster;
import edu.rit.NetworkActivity.data.entity.AuditLog;
import edu.rit.NetworkActivity.data.repository.AuditLogRepository;
import edu.rit.NetworkActivity.data.repository.ClusterRepository;
import edu.rit.NetworkActivity.service.dto.ClusterDto;
import edu.rit.NetworkActivity.service.dto.ClusterCreateRequest;
import edu.rit.NetworkActivity.service.dto.ClusterEventDto;
import edu.rit.NetworkActivity.service.dto.ClusterMergeRequest;
import edu.rit.NetworkActivity.service.dto.ClusterUpdateRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClusterService {

    private final ClusterRepository clusterRepository;
    private final AuditLogRepository auditLogRepository;

    public ClusterService(ClusterRepository clusterRepository, AuditLogRepository auditLogRepository) {
        this.clusterRepository = clusterRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<ClusterDto> list(String search, String entityType, String sortBy) {
        List<Cluster> clusters;
        if (entityType != null && !entityType.isBlank()) {
            clusters = clusterRepository.findByEntityType(entityType);
        } else if (search != null && !search.isBlank()) {
            clusters = clusterRepository.findByNameContainingIgnoreCase(search);
        } else {
            clusters = clusterRepository.findAll();
        }

        clusters.sort(getComparator(sortBy));
        return clusters.stream().map(this::toDto).toList();
    }

    public ClusterDto get(Long id) {
        return clusterRepository.findById(id).map(this::toDto).orElse(null);
    }

    public ClusterDto create(ClusterCreateRequest request) {
        Cluster cluster = new Cluster();
        cluster.setName(request.getName());
        cluster.setEntityType(request.getEntityType());
        cluster.setRiskLevel(request.getRiskLevel());

        Cluster saved = clusterRepository.save(cluster);

        auditLogRepository.save(buildAuditLog(
                null,
                "CLUSTER_CREATED",
                clusterEntityAffected(saved.getClusterId()),
                OffsetDateTime.now(),
                null,
                toAuditValue(saved)
        ));

        return toDto(saved);
    }

    public ClusterDto update(Long id, ClusterUpdateRequest request) {
        Optional<Cluster> maybe = clusterRepository.findById(id);
        if (maybe.isEmpty()) return null;

        Cluster cluster = maybe.get();

        String oldName = cluster.getName();
        String oldEntityType = cluster.getEntityType();
        Float oldRisk = cluster.getRiskLevel();

        if (request.getName() != null) cluster.setName(request.getName());
        if (request.getEntityType() != null) cluster.setEntityType(request.getEntityType());
        if (request.getRiskLevel() != null) cluster.setRiskLevel(request.getRiskLevel());

        Cluster saved = clusterRepository.save(cluster);

        if (changed(oldName, saved.getName())
                || changed(oldEntityType, saved.getEntityType())
                || changed(oldRisk, saved.getRiskLevel())) {
            auditLogRepository.save(buildAuditLog(
                    null,
                    "CLUSTER_UPDATED",
                    clusterEntityAffected(saved.getClusterId()),
                    OffsetDateTime.now(),
                    toAuditValue(oldName, oldEntityType, oldRisk),
                    toAuditValue(saved)
            ));
        }

        return toDto(saved);
    }

    public List<ClusterEventDto> events(Long clusterId) {
        return auditLogRepository.findByEntityAffectedOrderByTimestampDesc(clusterEntityAffected(clusterId)).stream()
                .map(this::toEventDtoFromAudit)
                .toList();
    }

    public ClusterDto merge(ClusterMergeRequest request) {
        if (request == null || request.getSourceClusterId() == null || request.getTargetClusterId() == null) return null;
        if (request.getSourceClusterId().equals(request.getTargetClusterId())) return null;

        Optional<Cluster> maybeSource = clusterRepository.findById(request.getSourceClusterId());
        Optional<Cluster> maybeTarget = clusterRepository.findById(request.getTargetClusterId());
        if (maybeSource.isEmpty() || maybeTarget.isEmpty()) return null;

        Cluster source = maybeSource.get();
        Cluster target = maybeTarget.get();

        String before = toAuditValue(target);

        // Minimal "merge": fill missing fields in target from source.
        if ((target.getName() == null || target.getName().isBlank()) && source.getName() != null) {
            target.setName(source.getName());
        }
        if ((target.getEntityType() == null || target.getEntityType().isBlank()) && source.getEntityType() != null) {
            target.setEntityType(source.getEntityType());
        }
        if (target.getRiskLevel() == null && source.getRiskLevel() != null) {
            target.setRiskLevel(source.getRiskLevel());
        }

        Cluster savedTarget = clusterRepository.save(target);

        // Delete source cluster row (no other FK refs in codebase currently).
        clusterRepository.delete(source);

        auditLogRepository.save(buildAuditLog(
                null,
                "CLUSTER_MERGED",
                clusterEntityAffected(savedTarget.getClusterId()),
                OffsetDateTime.now(),
                before,
                "mergedSourceId=" + source.getClusterId() + ";after=" + toAuditValue(savedTarget)
        ));

        return toDto(savedTarget);
    }

    public boolean delete(Long clusterId) {
        if (clusterId == null) return false;
        Optional<Cluster> maybe = clusterRepository.findById(clusterId);
        if (maybe.isEmpty()) return false;

        clusterRepository.deleteById(clusterId);
        auditLogRepository.save(buildAuditLog(
                null,
                "CLUSTER_DELETED",
                clusterEntityAffected(clusterId),
                OffsetDateTime.now(),
                toAuditValue(maybe.get()),
                null
        ));
        return true;
    }

    private ClusterDto toDto(Cluster cluster) {
        return ClusterDto.builder()
                .clusterId(cluster.getClusterId())
                .name(cluster.getName())
                .entityType(cluster.getEntityType())
                .riskLevel(cluster.getRiskLevel())
                .build();
    }

    private ClusterEventDto toEventDtoFromAudit(AuditLog log) {
        return ClusterEventDto.builder()
                .id(log.getLogId())
                .clusterId(parseClusterId(log.getEntityAffected()))
                .eventType(auditActionToEventType(log.getActionType()))
                .eventTs(log.getTimestamp())
                .summary(auditSummary(log))
                .actor(log.getUserId() == null ? null : log.getUserId().toString())
                .build();
    }

    private static AuditLog buildAuditLog(UUID userId,
                                          String actionType,
                                          String entityAffected,
                                          OffsetDateTime timestamp,
                                          String previousValue,
                                          String newValue) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setActionType(actionType);
        log.setEntityAffected(entityAffected);
        log.setTimestamp(timestamp);
        log.setPreviousValue(previousValue);
        log.setNewValue(newValue);
        return log;
    }

    private static String clusterEntityAffected(Long clusterId) {
        return "cluster:" + clusterId;
    }

    private static Long parseClusterId(String entityAffected) {
        if (entityAffected == null) return null;
        if (!entityAffected.startsWith("cluster:")) return null;
        try {
            return Long.parseLong(entityAffected.substring("cluster:".length()));
        } catch (Exception e) {
            return null;
        }
    }

    private static String auditActionToEventType(String actionType) {
        if (actionType == null) return "UPDATED";
        if ("CLUSTER_CREATED".equalsIgnoreCase(actionType)) return "CREATED";
        return "UPDATED";
    }

    private static String auditSummary(AuditLog log) {
        if (log == null) return "Cluster updated";
        String action = log.getActionType();
        if (action != null && action.equalsIgnoreCase("CLUSTER_CREATED")) return "Cluster created";
        return "Cluster updated";
    }

    private static String toAuditValue(Cluster c) {
        if (c == null) return null;
        return toAuditValue(c.getName(), c.getEntityType(), c.getRiskLevel());
    }

    private static String toAuditValue(String name, String entityType, Float riskLevel) {
        String safeName = name == null ? "" : name;
        String safeType = entityType == null ? "" : entityType;
        String safeRisk = riskLevel == null ? "" : String.valueOf(riskLevel);
        return "name=" + safeName + ";entityType=" + safeType + ";riskLevel=" + safeRisk;
    }

    private static boolean changed(Object oldVal, Object newVal) {
        if (oldVal == null && newVal == null) return false;
        if (oldVal == null) return true;
        return !oldVal.equals(newVal);
    }

    private Comparator<Cluster> getComparator(String sortBy) {
        String key = sortBy == null ? "" : sortBy.toLowerCase(Locale.ROOT);
        return switch (key) {
            case "name" -> Comparator.comparing(c -> c.getName() == null ? "" : c.getName().toLowerCase(Locale.ROOT));
            case "risk", "risklevel" -> Comparator.<Cluster, Float>comparing(c -> c.getRiskLevel() == null ? 0f : c.getRiskLevel()).reversed();
            case "type", "entitytype" -> Comparator.comparing(c -> c.getEntityType() == null ? "" : c.getEntityType().toLowerCase(Locale.ROOT));
            default -> Comparator.comparing(c -> c.getClusterId() == null ? 0L : c.getClusterId());
        };
    }
}

