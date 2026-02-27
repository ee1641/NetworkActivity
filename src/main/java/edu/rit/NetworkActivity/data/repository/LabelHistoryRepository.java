package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.LabelHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LabelHistoryRepository extends JpaRepository<LabelHistory, Long> {
    List<LabelHistory> findByLabelId(Long labelId);
}