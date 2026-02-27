package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(UUID userId);
}