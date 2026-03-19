package com.hostelhub.modules.auth.dto;

import java.util.UUID;

public record AuthResponse(
        boolean success,
        String message,
        UserProfile user,
        StudentProfile student,
        String token,
        String refreshToken,
        String devResetUrl
) {
    public record UserProfile(
            UUID id,
            String email,
            String role,
            String name,
            String phone,
            boolean canAccessDashboard
    ) {
    }

    public record StudentProfile(
            UUID id,
            String rollNumber,
            String department,
            String course,
            Integer year,
            String enrollmentStatus
    ) {
    }
}
