package com.hostelhub.modules.warden.controller;

import com.hostelhub.security.AuthenticatedUser;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warden/dashboard")
public class WardenDashboardController {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public WardenDashboardController(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('WARDEN','ADMIN')")
    public Map<String, Object> getDashboard(
            @RequestParam(required = false) UUID blockId,
            @AuthenticationPrincipal AuthenticatedUser principal
    ) {
        List<UUID> blockIds = jdbcTemplate.query(
                "SELECT id FROM hostel_blocks WHERE warden_user_id = :wardenId",
                new MapSqlParameterSource("wardenId", principal.getId()),
                (rs, rowNum) -> rs.getObject("id", UUID.class)
        );

        if (blockIds.isEmpty() && !"Admin".equals(principal.getRole())) {
            return Map.of(
                    "success", true,
                    "stats", Map.of(
                            "totalBlocks", 0,
                            "totalStudents", 0,
                            "pendingApplications", 0,
                            "acceptedApplications", 0,
                            "complaints", Map.of(
                                    "pending", 0,
                                    "assigned", 0,
                                    "inProgress", 0,
                                    "resolvedToday", 0
                            )
                    ),
                    "occupancy", List.of(),
                    "applications", List.of()
            );
        }

        List<UUID> targetBlockIds = blockId != null ? List.of(blockId) : blockIds;

        Integer totalBlocks = blockIds.isEmpty() ? 0 : jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM hostel_blocks WHERE id IN (:ids)",
                new MapSqlParameterSource("ids", blockIds),
                Integer.class
        );
        Integer totalStudents = targetBlockIds.isEmpty() ? 0 : jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM students WHERE hostel_block_id IN (:ids)",
                new MapSqlParameterSource("ids", targetBlockIds),
                Integer.class
        );

        List<Map<String, Object>> applicationStats = targetBlockIds.isEmpty() ? List.of() : jdbcTemplate.query("""
                SELECT status, COUNT(*) AS count
                FROM hostel_applications
                WHERE hostel_block_id IN (:ids)
                GROUP BY status
                """, new MapSqlParameterSource("ids", targetBlockIds), (rs, rowNum) -> Map.of(
                "status", rs.getString("status"),
                "count", rs.getInt("count")
        ));

        int pendingApplications = 0;
        int acceptedApplications = 0;
        for (Map<String, Object> row : applicationStats) {
            String status = (String) row.get("status");
            Integer count = (Integer) row.get("count");
            if ("Pending".equals(status)) {
                pendingApplications = count;
            }
            if ("Accepted".equals(status)) {
                acceptedApplications = count;
            }
        }

        List<Map<String, Object>> occupancy = blockIds.isEmpty() ? List.of() : jdbcTemplate.query("""
                SELECT id, block_name, type, total_rooms, occupied_rooms, available_rooms
                FROM hostel_blocks
                WHERE id IN (:ids)
                """, new MapSqlParameterSource("ids", blockIds), (rs, rowNum) -> {
            int totalRooms = rs.getInt("total_rooms");
            int occupiedRooms = rs.getInt("occupied_rooms");
            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("blockId", rs.getObject("id", UUID.class));
            mapped.put("blockName", rs.getString("block_name"));
            mapped.put("type", rs.getString("type"));
            mapped.put("totalRooms", totalRooms);
            mapped.put("occupiedRooms", occupiedRooms);
            mapped.put("availableRooms", rs.getInt("available_rooms"));
            mapped.put("occupancyRate", totalRooms == 0 ? "0.0" : String.format("%.1f", (occupiedRooms * 100.0) / totalRooms));
            return mapped;
        });

        List<Map<String, Object>> applications = targetBlockIds.isEmpty() ? List.of() : jdbcTemplate.query("""
                SELECT
                    ha.id, ha.status, ha.application_data, ha.created_at, ha.hostel_block_id,
                    s.id AS student_id, s.roll_number, s.course, s.year, s.department,
                    u.name, u.email, u.phone
                FROM hostel_applications ha
                JOIN students s ON ha.student_id = s.id
                JOIN users u ON s.user_id = u.id
                WHERE ha.hostel_block_id IN (:ids)
                ORDER BY ha.created_at DESC
                LIMIT 20
                """, new MapSqlParameterSource("ids", targetBlockIds), (rs, rowNum) -> {
            Map<String, Object> student = new LinkedHashMap<>();
            student.put("_id", rs.getObject("student_id", UUID.class));
            student.put("name", rs.getString("name"));
            student.put("email", rs.getString("email"));
            student.put("phone", rs.getString("phone"));
            student.put("rollNumber", rs.getString("roll_number"));
            student.put("course", rs.getString("course"));
            student.put("year", rs.getObject("year"));
            student.put("department", rs.getString("department"));
            student.put("feeStatus", Map.of("isPaid", true));

            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("status", rs.getString("status"));
            mapped.put("applicationData", rs.getString("application_data"));
            mapped.put("createdAt", rs.getTimestamp("created_at"));
            mapped.put("hostelBlockId", rs.getObject("hostel_block_id", UUID.class));
            mapped.put("studentId", student);
            return mapped;
        });

        Map<String, Object> complaints = new LinkedHashMap<>();
        complaints.put("pending", 0);
        complaints.put("assigned", 0);
        complaints.put("inProgress", 0);
        complaints.put("resolvedToday", 0);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalBlocks", totalBlocks == null ? 0 : totalBlocks);
        stats.put("totalStudents", totalStudents == null ? 0 : totalStudents);
        stats.put("studentsInBlock", blockId != null ? totalStudents : null);
        stats.put("pendingApplications", pendingApplications);
        stats.put("acceptedApplications", acceptedApplications);
        stats.put("complaints", complaints);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("stats", stats);
        response.put("occupancy", occupancy);
        response.put("applications", applications);
        return response;
    }
}
