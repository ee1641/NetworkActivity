package edu.rit.NetworkActivity.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Smoke-tests the supabase.jwt.secret that is configured in
 * src/main/resources/application.properties.
 *
 * Run this whenever you rotate the Supabase JWT secret to confirm
 * the new value is correctly set and usable.
 */
class JwtConfigValidationTest {

    @Test
    void jwtSecretIsSetAndNotAPlaceholder() throws Exception {
        String secret = loadSecret();

        assertNotNull(secret, "supabase.jwt.secret is missing from application.properties");
        assertFalse(secret.isBlank(), "supabase.jwt.secret must not be blank");
        assertNotEquals("your-supabase-jwt-secret-here", secret,
                "supabase.jwt.secret is still the placeholder — paste the real Supabase secret");
    }

    @Test
    void jwtSecretIsLongEnoughForHmacSha256() throws Exception {
        byte[] keyBytes = loadSecret().getBytes(StandardCharsets.UTF_8);

        assertTrue(keyBytes.length >= 32,
                "JWT secret must be at least 32 bytes for HMAC-SHA256 but got " + keyBytes.length + " bytes");
    }

    @Test
    void jwtServiceCanSignAndValidateATokenWithConfiguredSecret() throws Exception {
        String secret = loadSecret();
        JwtService jwtService = new JwtService(secret);

        // Build a token the same way Supabase would
        String token = Jwts.builder()
                .subject("test-user-id-abc123")
                .claim("role", "authenticated")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3_600_000L))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        Claims claims = jwtService.validateToken(token);

        assertEquals("test-user-id-abc123", jwtService.extractUserId(claims));
        assertEquals("authenticated", jwtService.extractRole(claims));
    }

    @Test
    void jwtFilterAcceptsTokenSignedWithConfiguredSecret() throws Exception {
        String secret = loadSecret();
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(new JwtService(secret));

        String token = Jwts.builder()
                .subject("test-user-id-abc123")
                .claim("role", "authenticated")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3_600_000L))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        var req = new org.springframework.mock.web.MockHttpServletRequest("GET", "/api/metrics/summary");
        req.addHeader("Authorization", "Bearer " + token);
        var res = new org.springframework.mock.web.MockHttpServletResponse();
        var chainCalled = new java.util.concurrent.atomic.AtomicBoolean(false);

        filter.doFilterInternal(req, res, (r, p) -> chainCalled.set(true));

        assertTrue(chainCalled.get(), "filter chain should be called for a valid token");
        assertEquals(200, res.getStatus(), "filter should not set 401 for a valid token");
        assertNotNull(
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext().getAuthentication(),
                "authentication should be set in SecurityContext");

        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private String loadSecret() throws Exception {
        Properties props = new Properties();
        try (InputStream stream = getClass()
                .getClassLoader()
                .getResourceAsStream("application.properties")) {
            assertNotNull(stream, "application.properties not found on classpath");
            props.load(stream);
        }
        return props.getProperty("supabase.jwt.secret");
    }
}
