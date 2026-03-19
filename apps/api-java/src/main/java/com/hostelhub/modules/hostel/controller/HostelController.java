package com.hostelhub.modules.hostel.controller;

import com.hostelhub.modules.hostel.dto.HostelSummaryDto;
import com.hostelhub.modules.hostel.service.HostelService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hostels")
public class HostelController {

    private final HostelService hostelService;

    public HostelController(HostelService hostelService) {
        this.hostelService = hostelService;
    }

    @GetMapping
    public List<HostelSummaryDto> getHostels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minRating
    ) {
        return hostelService.getHostels(location, type, minRating);
    }
}
