package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.UserProfile;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import edu.rit.NetworkActivity.service.UserProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private static final Logger log = LoggerFactory.getLogger(UserProfileController.class);
    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    /**
     * GET /api/users/me/role
     *
     * Returns the calling user's application role from user_profiles.
     * Every authenticated user can call this — no elevated role required.
     */
    @GetMapping("/me/role")
    public ResponseEntity<Map<String, Object>> getMyRole() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = UUID.fromString(auth.getName());   // principal = Supabase sub claim
        Optional<UserProfile> profile = userProfileService.findByUserId(userId);

        String role = profile.map(UserProfile::getRole).orElse("authenticated");
        LogStrategy.info(log, LogEvents.API_ROLE_GET, "userId", userId, "role", role);
        return ResponseEntity.ok(Map.of("userId", userId.toString(), "role", role));
    }

    /**
     * PUT /api/users/{userId}/role
     * Body: { "role": "admin" }
     *
     * Restricted to users whose JWT role claim is SERVICE_ROLE (Supabase service key),
     * which acts as the system-level admin in this architecture.
     * Full admin-panel role assignment UI is pending (friend's sprint).
     */
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('SERVICE_ROLE')")
    public ResponseEntity<Map<String, Object>> setRole(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> body) {

        String newRole = body.get("role");
        if (newRole == null || newRole.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "role field is required"));
        }

        UserProfile saved = userProfileService.setRole(userId, newRole);
        LogStrategy.info(log, LogEvents.API_ROLE_UPDATE, "userId", userId, "role", saved.getRole());
        return ResponseEntity.ok(Map.of("userId", userId.toString(), "role", saved.getRole()));
    }
}
