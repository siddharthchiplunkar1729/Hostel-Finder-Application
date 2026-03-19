package com.hostelhub.modules.admin.controller;

import com.hostelhub.modules.admin.dto.AdminHostelStatusRequest;
import com.hostelhub.modules.admin.dto.AdminHostelSummaryDto;
import com.hostelhub.modules.admin.service.AdminHostelService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/hostels")
@PreAuthorize("hasRole('ADMIN')")
public class AdminHostelController {

    private final AdminHostelService adminHostelService;

    public AdminHostelController(AdminHostelService adminHostelService) {
        this.adminHostelService = adminHostelService;
    }

    @GetMapping
    public List<AdminHostelSummaryDto> getAdminHostels(@RequestParam(required = false) String status) {
        return adminHostelService.getAdminHostels(status);
    }

    @PatchMapping("/{id}")
    public Map<String, Object> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody AdminHostelStatusRequest request
    ) {
        AdminHostelSummaryDto hostel = adminHostelService.updateApprovalStatus(id, request);
        return Map.of(
                "success", true,
                "message", "Hostel " + request.status().toLowerCase() + " successfully",
                "data", hostel
        );
    }
}
