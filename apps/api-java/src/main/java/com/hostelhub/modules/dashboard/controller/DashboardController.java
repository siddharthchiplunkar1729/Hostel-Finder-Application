package com.hostelhub.modules.dashboard.controller;

import com.hostelhub.security.AuthenticatedUser;
import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DashboardController(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public Map<String, Object> getDashboard(@AuthenticationPrincipal AuthenticatedUser principal) {
        UUID studentId = jdbcTemplate.query(
                "SELECT id FROM students WHERE user_id = :userId",
                new MapSqlParameterSource("userId", principal.getId()),
                rs -> rs.next() ? rs.getObject("id", UUID.class) : null
        );

        if (studentId == null) {
            throw new IllegalArgumentException("Student profile not found");
        }

        Map<String, Object> student = jdbcTemplate.query("""
                SELECT s.*, u.name, u.email, u.can_access_dashboard, hb.block_name
                FROM students s
                JOIN users u ON s.user_id = u.id
                LEFT JOIN hostel_blocks hb ON s.hostel_block_id = hb.id
                WHERE s.id = :studentId
                """, new MapSqlParameterSource("studentId", studentId), rs -> {
            if (!rs.next()) {
                return null;
            }
            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("name", rs.getString("name"));
            mapped.put("rollNumber", rs.getString("roll_number"));
            mapped.put("roomNumber", rs.getString("room_number"));
            mapped.put("course", rs.getString("course"));
            mapped.put("year", rs.getObject("year"));
            mapped.put("enrollmentStatus", rs.getString("enrollment_status"));
            mapped.put("canAccessDashboard", rs.getBoolean("can_access_dashboard"));
            mapped.put("feeStatus", Map.of(
                    "isPaid", "Active".equals(rs.getString("enrollment_status")) || rs.getBoolean("can_access_dashboard"),
                    "lastPayment", rs.getTimestamp("updated_at")
            ));
            return mapped;
        });

        List<Map<String, Object>> complaints = jdbcTemplate.query("""
                SELECT id, title, status, created_at
                FROM complaints
                WHERE student_id = :studentId
                ORDER BY created_at DESC
                LIMIT 3
                """, new MapSqlParameterSource("studentId", studentId), (rs, rowNum) -> Map.of(
                "_id", rs.getObject("id", UUID.class),
                "title", rs.getString("title"),
                "status", rs.getString("status"),
                "createdAt", rs.getTimestamp("created_at")
        ));

        List<Map<String, Object>> notices = jdbcTemplate.query("""
                SELECT n.*, hb.block_name
                FROM notices n
                LEFT JOIN hostel_blocks hb ON n.hostel_block_id = hb.id
                ORDER BY n.created_at DESC
                LIMIT 4
                """, new MapSqlParameterSource(), (rs, rowNum) -> {
            Map<String, Object> from = new LinkedHashMap<>();
            from.put("role", "Administrative Officer");
            from.put("name", rs.getString("block_name") != null ? rs.getString("block_name") : "Hostel Hub System");

            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("title", rs.getString("title"));
            mapped.put("content", rs.getString("content"));
            mapped.put("priority", rs.getString("priority"));
            mapped.put("type", switch (rs.getString("priority")) {
                case "Urgent" -> "Emergency";
                case "High" -> "Important";
                default -> "General";
            });
            mapped.put("from", from);
            mapped.put("createdAt", rs.getTimestamp("created_at"));
            mapped.put("hostelName", rs.getString("block_name"));
            return mapped;
        });

        String dayName = capitalize(LocalDate.now().getDayOfWeek().name());
        Map<String, Object> menu = jdbcTemplate.query("""
                SELECT mm.*
                FROM mess_menu mm
                JOIN students s ON mm.hostel_block_id = s.hostel_block_id
                WHERE s.id = :studentId AND LOWER(mm.day) = LOWER(:day)
                LIMIT 1
                """, new MapSqlParameterSource()
                .addValue("studentId", studentId)
                .addValue("day", dayName), rs -> {
            if (!rs.next()) {
                return null;
            }
            return mapDashboardMenu(rs);
        });

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("student", student);
        response.put("complaints", complaints);
        response.put("notices", notices);
        response.put("messMenu", menu);
        return response;
    }

    private Map<String, Object> mapDashboardMenu(java.sql.ResultSet rs) throws java.sql.SQLException {
        return Map.of(
                "_id", rs.getObject("id", UUID.class),
                "date", java.time.Instant.now().toString(),
                "day", rs.getString("day"),
                "specialMenu", false,
                "meals", List.of(
                        meal("Breakfast", rs.getString("breakfast"), "07:30 AM - 09:30 AM", rs.getInt("breakfast_up"), rs.getInt("breakfast_down")),
                        meal("Lunch", rs.getString("lunch"), "12:30 PM - 02:30 PM", rs.getInt("lunch_up"), rs.getInt("lunch_down")),
                        meal("Snacks", rs.getString("snacks"), "04:30 PM - 05:30 PM", rs.getInt("snacks_up"), rs.getInt("snacks_down")),
                        meal("Dinner", rs.getString("dinner"), "07:30 PM - 09:30 PM", rs.getInt("dinner_up"), rs.getInt("dinner_down"))
                )
        );
    }

    private Map<String, Object> meal(String type, String items, String timings, int thumbsUp, int thumbsDown) {
        return Map.of(
                "mealType", type,
                "items", items == null || items.isBlank() ? List.of() : List.of(items.split("\\s*,\\s*")),
                "timings", timings,
                "isVeg", true,
                "thumbsUp", thumbsUp,
                "thumbsDown", thumbsDown
        );
    }

    private String capitalize(String value) {
        String lower = value.toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
