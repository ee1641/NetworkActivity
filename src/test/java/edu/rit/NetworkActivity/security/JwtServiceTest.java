package edu.rit.NetworkActivity.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    // Must be ≥ 32 bytes for HMAC-SHA256
    private static final String SECRET = "test-secret-that-is-long-enough-for-hmac!";
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    private String buildToken(String subject, String role, long expiresInMs) {
        return Jwts.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiresInMs))
                .signWith(signingKey())
                .compact();
    }

    // ── validateToken ─────────────────────────────────────────────────────────

    @Test
    void validTokenReturnsClaims() {
        String token = buildToken("user-abc", "authenticated", 3_600_000L);
        Claims claims = jwtService.validateToken(token);
        assertNotNull(claims);
        assertEquals("user-abc", claims.getSubject());
    }

    @Test
    void expiredTokenThrowsJwtException() {
        String token = buildToken("user-abc", "authenticated", -1_000L);
        assertThrows(JwtException.class, () -> jwtService.validateToken(token));
    }

    @Test
    void wrongSecretThrowsJwtException() {
        SecretKey otherKey = Keys.hmacShaKeyFor(
                "completely-different-secret-at-least-32bytes!!".getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                .subject("user-abc")
                .expiration(new Date(System.currentTimeMillis() + 3_600_000L))
                .signWith(otherKey)
                .compact();
        assertThrows(JwtException.class, () -> jwtService.validateToken(token));
    }

    @Test
    void malformedTokenThrowsJwtException() {
        assertThrows(JwtException.class, () -> jwtService.validateToken("this.is.not.a.jwt"));
    }

    // ── extractUserId ─────────────────────────────────────────────────────────

    @Test
    void extractsUserIdFromSubjectClaim() {
        String token = buildToken("user-abc", "authenticated", 3_600_000L);
        Claims claims = jwtService.validateToken(token);
        assertEquals("user-abc", jwtService.extractUserId(claims));
    }

    // ── extractRole ───────────────────────────────────────────────────────────

    @Test
    void extractsRoleFromRoleClaim() {
        String token = buildToken("user-abc", "service_role", 3_600_000L);
        Claims claims = jwtService.validateToken(token);
        assertEquals("service_role", jwtService.extractRole(claims));
    }

    @Test
    void defaultsToAuthenticatedWhenRoleClaimAbsent() {
        String token = Jwts.builder()
                .subject("user-abc")
                .expiration(new Date(System.currentTimeMillis() + 3_600_000L))
                .signWith(signingKey())
                .compact();
        Claims claims = jwtService.validateToken(token);
        assertEquals("authenticated", jwtService.extractRole(claims));
    }
}
