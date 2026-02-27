package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Cluster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClusterRepository extends JpaRepository<Cluster, Long> {
    List<Cluster> findByEntityType(String entityType);
}