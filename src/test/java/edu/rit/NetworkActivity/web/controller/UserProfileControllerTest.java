package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.UserProfile;
import edu.rit.NetworkActivity.service.UserProfileService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserProfileControllerTest {

    @Mock UserProfileService userProfileService;
    @InjectMocks UserProfileController userProfileController;

    private MockMvc mockMvc;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userProfileController).build();
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    /** Populate SecurityContextHolder so the controller can read auth.getName(). */
    private void loginAs(UUID id, String role) {
        var auth = new UsernamePasswordAuthenticationToken(
                id.toString(), null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    // ── GET /api/users/me/role ────────────────────────────────────────────────

    @Test
    void getMyRoleReturnsRoleFromProfile() throws Exception {
        loginAs(userId, "authenticated");
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setRole("analyst");
        when(userProfileService.findByUserId(userId)).thenReturn(Optional.of(profile));

        mockMvc.perform(get("/api/users/me/role"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("analyst"))
                .andExpect(jsonPath("$.userId").value(userId.toString()));
    }

    @Test
    void getMyRoleDefaultsToAuthenticatedWhenNoProfile() throws Exception {
        loginAs(userId, "authenticated");
        when(userProfileService.findByUserId(userId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/me/role"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("authenticated"));
    }

    // ── PUT /api/users/{userId}/role ──────────────────────────────────────────

    @Test
    void setRoleUpdatesProfile() throws Exception {
        loginAs(userId, "service_role");
        UserProfile saved = new UserProfile();
        saved.setUserId(userId);
        saved.setRole("admin");
        when(userProfileService.setRole(eq(userId), eq("admin"))).thenReturn(saved);

        mockMvc.perform(put("/api/users/" + userId + "/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"role\":\"admin\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("admin"));
    }

    @Test
    void setRoleReturnsBadRequestWhenRoleMissing() throws Exception {
        loginAs(userId, "service_role");

        mockMvc.perform(put("/api/users/" + userId + "/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
