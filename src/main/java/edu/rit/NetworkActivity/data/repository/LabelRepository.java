package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LabelRepository extends JpaRepository<Label, Long> {
    Optional<Label> findByAddress(String address);
    List<Label> findByCategory(String category);
    List<Label> findByTargetAddress(String targetAddress);
}