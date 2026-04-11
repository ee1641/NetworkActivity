package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.AuditLog;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.AuditLogRepository;
import edu.rit.NetworkActivity.data.repository.ClusterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.OffsetDateTime;

@Service
public class ClusterWalletService {

    @PersistenceContext
    private EntityManager entityManager;

    private final ClusterRepository clusterRepository;
    private final AddressRepository addressRepository;
    private final AuditLogRepository auditLogRepository;

    public ClusterWalletService(ClusterRepository clusterRepository,
                                AddressRepository addressRepository,
                                AuditLogRepository auditLogRepository) {
        this.clusterRepository = clusterRepository;
        this.addressRepository = addressRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void addWalletToCluster(Long clusterId, String addressText) {
        if (clusterId == null) throw new IllegalArgumentException("clusterId is required");
        if (addressText == null || addressText.isBlank()) throw new IllegalArgumentException("address is required");

        if (!clusterRepository.existsById(clusterId)) {
            throw new IllegalArgumentException("cluster not found");
        }

        String normalized = addressText.trim();

        Address address = addressRepository.findByAddressIgnoreCase(normalized)
                .orElseGet(() -> {
                    Address a = new Address();
                    a.setAddress(normalized);
                    a.setType("unknown");
                    a.setBalance(0.0f);
                    a.setRiskScore(0.0f);
                    a.setFirstSeen(OffsetDateTime.now());
                    a.setLastActive(OffsetDateTime.now());
                    return addressRepository.save(a);
                });

        // cluster_wallets has FK to addresses.id (NOT addresses.address text)
        // Schema: cluster_wallets(cluster_id bigint, wallet_id bigint)
        Number existing = (Number) entityManager.createNativeQuery("""
                        select count(1)
                        from cluster_wallets
                        where cluster_id = :clusterId and wallet_id = :walletId
                        """)
                .setParameter("clusterId", clusterId)
                .setParameter("walletId", address.getId())
                .getSingleResult();

        if (existing == null || existing.longValue() == 0L) {
            entityManager.createNativeQuery("""
                            insert into cluster_wallets (cluster_id, wallet_id)
                            values (:clusterId, :walletId)
                            """)
                    .setParameter("clusterId", clusterId)
                    .setParameter("walletId", address.getId())
                    .executeUpdate();
        }

        AuditLog log = new AuditLog();
        log.setUserId(null);
        log.setActionType("CLUSTER_WALLET_ADDED");
        log.setEntityAffected("cluster:" + clusterId);
        log.setTimestamp(OffsetDateTime.now());
        log.setPreviousValue(null);
        log.setNewValue("addressId=" + address.getId() + ";address=" + address.getAddress());
        auditLogRepository.save(log);
    }

    @Transactional
    public void deleteAllWalletLinksForCluster(Long clusterId) {
        if (clusterId == null) return;
        entityManager.createNativeQuery("""
                        delete from cluster_wallets
                        where cluster_id = :clusterId
                        """)
                .setParameter("clusterId", clusterId)
                .executeUpdate();
    }
}

