package com.hostelhub.modules.auth.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank String name,
        @NotBlank String phone,
        String role,
        @Valid StudentSignupData studentData
) {
    public record StudentSignupData(
            String rollNumber,
            String department,
            String course,
            Integer year
    ) {
    }
}
