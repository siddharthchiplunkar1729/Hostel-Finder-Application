package com.hostelhub.security;

import com.hostelhub.modules.users.entity.UserEntity;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final Duration accessTokenTtl;
    private final Duration refreshTokenTtl;
    private final Duration resetTokenTtl;

    public JwtService(
            JwtEncoder jwtEncoder,
            JwtDecoder jwtDecoder,
            @Value("${app.security.access-token-ttl}") Duration accessTokenTtl,
            @Value("${app.security.refresh-token-ttl}") Duration refreshTokenTtl,
            @Value("${app.security.reset-token-ttl}") Duration resetTokenTtl
    ) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
        this.accessTokenTtl = accessTokenTtl;
        this.refreshTokenTtl = refreshTokenTtl;
        this.resetTokenTtl = resetTokenTtl;
    }

    public String generateAccessToken(UserEntity user) {
        return generateToken(user, accessTokenTtl, Map.of(
                "type", "access",
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    public String generateRefreshToken(UserEntity user) {
        return generateToken(user, refreshTokenTtl, Map.of("type", "refresh"));
    }

    public String generatePasswordResetToken(UserEntity user) {
        return generateToken(user, resetTokenTtl, Map.of(
                "type", "password_reset",
                "passwordVersion", getPasswordVersion(user.getPassword())
        ));
    }

    public Jwt decode(String token) {
        return jwtDecoder.decode(token);
    }

    public boolean isAccessToken(String token) {
        return "access".equals(decode(token).getClaimAsString("type"));
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(decode(token).getSubject());
    }

    public String getPasswordVersion(String passwordHash) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(passwordHash.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte value : hash) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to compute password version", exception);
        }
    }

    private String generateToken(UserEntity user, Duration ttl, Map<String, Object> claims) {
        Instant now = Instant.now();
        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(now.plus(ttl))
                .subject(user.getId().toString());

        claims.forEach(claimsBuilder::claim);

        return jwtEncoder.encode(
                JwtEncoderParameters.from(
                        JwsHeader.with(MacAlgorithm.HS256).build(),
                        claimsBuilder.build()
                )
        ).getTokenValue();
    }
}
