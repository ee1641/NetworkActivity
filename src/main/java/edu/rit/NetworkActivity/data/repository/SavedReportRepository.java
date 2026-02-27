package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.SavedReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SavedReportRepository extends JpaRepository<SavedReport, Long> {
    List<SavedReport> findByUserId(UUID userId);
}