package com.hostelhub.modules.auth.controller;

import com.hostelhub.modules.auth.dto.AuthResponse;
import com.hostelhub.modules.auth.dto.ForgotPasswordRequest;
import com.hostelhub.modules.auth.dto.LoginRequest;
import com.hostelhub.modules.auth.dto.ResetPasswordRequest;
import com.hostelhub.modules.auth.dto.SignupRequest;
import com.hostelhub.modules.auth.service.AuthService;
import com.hostelhub.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @GetMapping("/me")
    public AuthResponse me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return authService.me(principal);
    }

    @PostMapping("/forgot-password")
    public AuthResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public AuthResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout() {
        return Map.of(
                "success", true,
                "message", "Logged out successfully"
        );
    }
}
