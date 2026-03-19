package com.hostelhub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminHostelStatusRequest(
        @NotBlank String status,
        String remarks
) {
}
