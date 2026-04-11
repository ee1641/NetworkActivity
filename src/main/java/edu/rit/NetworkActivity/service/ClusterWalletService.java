package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.AuditLog;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.AuditLogRepository;
import edu.rit.NetworkActivity.data.repository.ClusterRepository;
import edu.rit.NetworkActivity.service.dto.ClusterWalletDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

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

    /**
     * Removes one wallet link from the cluster (cluster_wallets row only; does not delete addresses).
     *
     * @return true if a row was deleted
     */
    @Transactional
    public boolean removeWalletFromCluster(Long clusterId, Long walletId) {
        if (clusterId == null || walletId == null) {
            throw new IllegalArgumentException("clusterId and walletId are required");
        }
        if (!clusterRepository.existsById(clusterId)) {
            throw new IllegalArgumentException("cluster not found");
        }

        String addressText = addressRepository.findById(walletId)
                .map(Address::getAddress)
                .orElse(null);

        int deleted = entityManager.createNativeQuery("""
                        delete from cluster_wallets
                        where cluster_id = :clusterId and wallet_id = :walletId
                        """)
                .setParameter("clusterId", clusterId)
                .setParameter("walletId", walletId)
                .executeUpdate();

        if (deleted > 0) {
            AuditLog log = new AuditLog();
            log.setUserId(null);
            log.setActionType("CLUSTER_WALLET_REMOVED");
            log.setEntityAffected("cluster:" + clusterId);
            log.setTimestamp(OffsetDateTime.now());
            log.setPreviousValue("addressId=" + walletId + (addressText != null ? ";address=" + addressText : ""));
            log.setNewValue(null);
            auditLogRepository.save(log);
        }

        return deleted > 0;
    }

    @Transactional(readOnly = true)
    public List<ClusterWalletDto> listWalletsForCluster(Long clusterId) {
        if (clusterId == null || !clusterRepository.existsById(clusterId)) {
            return List.of();
        }
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery("""
                        select a.id, a.address
                        from cluster_wallets cw
                        join addresses a on a.id = cw.wallet_id
                        where cw.cluster_id = :clusterId
                        order by lower(a.address)
                        """)
                .setParameter("clusterId", clusterId)
                .getResultList();

        List<ClusterWalletDto> out = new ArrayList<>();
        for (Object[] row : rows) {
            Long id = row[0] == null ? null : ((Number) row[0]).longValue();
            String addr = row[1] == null ? null : row[1].toString();
            out.add(ClusterWalletDto.builder().walletId(id).address(addr).build());
        }
        return out;
    }
}

