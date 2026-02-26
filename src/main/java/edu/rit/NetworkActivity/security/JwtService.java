package edu.rit.NetworkActivity.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Validates Supabase-issued JWT tokens (HS256).
 *
 * The JWT secret lives in application.properties as {@code supabase.jwt.secret}
 * and must match the value shown in your Supabase dashboard under
 * Settings › API › JWT Secret.
 */
@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(@Value("${supabase.jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Parses and validates the token.
     *
     * @return parsed Claims on success
     * @throws JwtException if the token is invalid or expired
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** Extracts the Supabase user ID (sub claim) from a validated token. */
    public String extractUserId(Claims claims) {
        return claims.getSubject();
    }

    /** Extracts the user's role from a validated token (defaults to "authenticated"). */
    public String extractRole(Claims claims) {
        Object role = claims.get("role");
        return role != null ? role.toString() : "authenticated";
    }
}
