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

class JwtAuthenticationFilterTest {

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

    // ── helpers ──────────────────────────────────────────────────────────────

    private String buildToken(String subject, long expiresInMs) {
        var key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject(subject)
                .claim("role", "authenticated")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiresInMs))
                .signWith(key)
                .compact();
    }

    // ── tests ─────────────────────────────────────────────────────────────────

    @Test
    void noAuthHeaderPassesThroughWithoutSettingAuthentication()
            throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/metrics/summary");
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertTrue(chainCalled.get(), "filter chain should be called");
        assertNull(SecurityContextHolder.getContext().getAuthentication(),
                "no auth should be set when header is absent");
    }

    @Test
    void nonBearerAuthHeaderPassesThroughWithoutSettingAuthentication()
            throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/metrics/summary");
        req.addHeader("Authorization", "Basic dXNlcjpwYXNz");
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertTrue(chainCalled.get());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void validBearerTokenSetsAuthenticationAndCallsChain()
            throws ServletException, IOException {
        String token = buildToken("user-123", 3_600_000L);
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/metrics/summary");
        req.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertTrue(chainCalled.get());
        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth, "auth should be set for a valid token");
        assertEquals("user-123", auth.getPrincipal());
        assertTrue(auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_AUTHENTICATED")));
    }

    @Test
    void invalidTokenReturns401AndDoesNotCallChain()
            throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/metrics/summary");
        req.addHeader("Authorization", "Bearer not.a.valid.jwt");
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertFalse(chainCalled.get(), "chain should NOT be called for an invalid token");
        assertEquals(401, res.getStatus());
    }

    @Test
    void expiredTokenReturns401()
            throws ServletException, IOException {
        String token = buildToken("user-123", -1_000L); // already expired
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/posts");
        req.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        FilterChain chain = (r, p) -> chainCalled.set(true);

        filter.doFilterInternal(req, res, chain);

        assertFalse(chainCalled.get());
        assertEquals(401, res.getStatus());
    }
}
