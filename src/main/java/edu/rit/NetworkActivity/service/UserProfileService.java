package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.UserProfile;
import edu.rit.NetworkActivity.data.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileService {

    private final UserProfileRepository repo;

    public UserProfileService(UserProfileRepository repo) {
        this.repo = repo;
    }

    public Optional<UserProfile> findByUserId(UUID userId) {
        return repo.findByUserId(userId);
    }

    /**
     * Updates (or creates) the role for a user profile.
     * Returns the saved profile.
     */
    public UserProfile setRole(UUID userId, String newRole) {
        UserProfile profile = repo.findByUserId(userId).orElseGet(() -> {
            UserProfile p = new UserProfile();
            p.setUserId(userId);
            p.setCreatedAt(OffsetDateTime.now());
            return p;
        });
        profile.setRole(newRole);
        profile.setUpdatedAt(OffsetDateTime.now());
        return repo.save(profile);
    }
}
