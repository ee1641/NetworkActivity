package edu.rit.NetworkActivity.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.*;

/**
 * End-to-end security pipeline tests.
 *
 * These tests run the real JwtService + JwtAuthenticationFilter together to
 * confirm the complete auth path behaves correctly for each scenario a client
 * of /api/** might encounter:
 *
 *   - no token  → filter passes through, SecurityContext is empty
 *   - valid JWT  → SecurityContext populated, chain continues
 *   - expired JWT → 401, chain halted
 *   - tampered JWT → 401, chain halted
 *
 * Note: verifying that Spring Security's authorization layer actually returns
 * 401 for an empty SecurityContext requires a full application context.
 * The authorization rules in SecurityConfig are separately exercised via
 * the integration test suite.  These tests confirm the filter layer, which
 * is the component that distinguishes authenticated from unauthenticated.
 */
class SecurityConfigTest {

    private static final String SECRET = "test-secret-that-is-long-enough-for-hmac!";

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter(new JwtService(SECRET));
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void requestWithNoTokenPassesThroughWithEmptySecurityContext()
            throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/metrics/summary");
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertTrue(chainCalled.get(), "chain must be called so Spring Security can decide");
        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "no auth must be set — Spring Security will then deny with 401");
        assertEquals(200, res.getStatus(), "filter itself does not set 401 for missing token");
    }

    @Test
    void requestWithValidJwtPopulatesSecurityContextAndContinues()
            throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/metrics/summary");
        req.addHeader("Authorization", "Bearer " + validToken());
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertTrue(chainCalled.get());
        assertNotNull(SecurityContextHolder.getContext().getAuthentication(),
                "auth must be present so Spring Security allows the request");
    }

    @Test
    void requestWithExpiredJwtReturns401AndHaltsChain()
            throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/posts");
        req.addHeader("Authorization", "Bearer " + expiredToken());
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertFalse(chainCalled.get());
        assertEquals(401, res.getStatus());
    }

    @Test
    void requestWithTamperedJwtReturns401AndHaltsChain()
            throws ServletException, IOException {
        // Build a valid token, then flip one char in the signature
        String token = validToken();
        String tampered = token.substring(0, token.length() - 4) + "XXXX";

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/vechain/status");
        req.addHeader("Authorization", "Bearer " + tampered);
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertFalse(chainCalled.get());
        assertEquals(401, res.getStatus());
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private String validToken() {
        return Jwts.builder()
                .subject("user-abc")
                .claim("role", "authenticated")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3_600_000L))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private String expiredToken() {
        return Jwts.builder()
                .subject("user-abc")
                .claim("role", "authenticated")
                .issuedAt(new Date(System.currentTimeMillis() - 7_200_000L))
                .expiration(new Date(System.currentTimeMillis() - 3_600_000L))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
