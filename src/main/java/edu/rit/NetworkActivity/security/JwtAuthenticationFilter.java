package edu.rit.NetworkActivity.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Intercepts every request and, when a valid Supabase Bearer token is present,
 * populates the Spring Security context so that downstream security rules can
 * enforce authentication requirements.
 *
 * Flow:
 *   1. Extract "Authorization: Bearer <token>" header.
 *   2. Validate the JWT via JwtService (HMAC-SHA256, Supabase secret).
 *   3. Build a UsernamePasswordAuthenticationToken carrying the user's Supabase
 *      UUID as the principal and their role as a GrantedAuthority.
 *   4. Store it in SecurityContextHolder.
 *
 * If no token is present the filter does nothing — Spring Security's own
 * authorization rules in SecurityConfig then decide whether to allow or reject
 * the request.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = jwtService.validateToken(token);
            String userId = jwtService.extractUserId(claims);
            String role   = jwtService.extractRole(claims);

            var auth = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException e) {
            // Invalid / expired token — clear context and let the 401 flow naturally
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
