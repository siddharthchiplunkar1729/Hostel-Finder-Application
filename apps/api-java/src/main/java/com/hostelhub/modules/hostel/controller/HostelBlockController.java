package com.hostelhub.modules.hostel.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hostel-blocks")
public class HostelBlockController {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public HostelBlockController(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getBlocks(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String types,
            @RequestParam(required = false) String facilities
    ) {
        StringBuilder sql = new StringBuilder("""
                SELECT hb.*, u.name AS warden_name, u.phone AS warden_phone
                FROM hostel_blocks hb
                LEFT JOIN users u ON hb.warden_user_id = u.id
                WHERE (hb.approval_status = 'Approved' OR hb.approval_status IS NULL)
                """);
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (location != null && !location.isBlank()) {
            sql.append(" AND hb.location ILIKE :location");
            params.addValue("location", "%" + location + "%");
        }

        if (types != null && !types.isBlank()) {
            List<String> typeList = List.of(types.split("\\s*,\\s*"));
            sql.append(" AND hb.type IN (:types)");
            params.addValue("types", typeList);
        }

        if (facilities != null && !facilities.isBlank()) {
            List<String> facilityList = List.of(facilities.split("\\s*,\\s*"));
            List<String> checks = new ArrayList<>();
            for (int i = 0; i < facilityList.size(); i++) {
                String key = "facility" + i;
                checks.add("array_to_string(hb.facilities, ',') ILIKE :" + key);
                params.addValue(key, "%" + facilityList.get(i) + "%");
            }
            sql.append(" AND (").append(String.join(" OR ", checks)).append(")");
        }

        sql.append(" ORDER BY hb.rating DESC");

        return jdbcTemplate.query(sql.toString(), params, (rs, rowNum) -> mapHostelBlockSummary(rs));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createBlock(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO hostel_blocks
                (block_name, type, description, total_rooms, available_rooms, location, images, facilities, warden_user_id)
                VALUES (:blockName, :type, :description, :totalRooms, :availableRooms, :location, CAST(:images AS text[]), CAST(:facilities AS text[]), :wardenId)
                RETURNING *
                """;

        String[] images = body.get("images") instanceof List<?> list ? list.stream().map(String::valueOf).toArray(String[]::new) : new String[0];
        String[] facilities = body.get("facilities") instanceof List<?> list ? list.stream().map(String::valueOf).toArray(String[]::new) : new String[0];

        return jdbcTemplate.query(sql, new MapSqlParameterSource()
                .addValue("blockName", body.get("blockName"))
                .addValue("type", body.get("type"))
                .addValue("description", body.get("description"))
                .addValue("totalRooms", body.get("totalRooms"))
                .addValue("availableRooms", body.get("availableRooms"))
                .addValue("location", body.get("location"))
                .addValue("images", toArrayLiteral(images))
                .addValue("facilities", toArrayLiteral(facilities))
                .addValue("wardenId", body.get("wardenId")), rs -> {
            if (!rs.next()) {
                throw new IllegalArgumentException("Failed to create hostel block");
            }
            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("blockName", rs.getString("block_name"));
            mapped.put("type", rs.getString("type"));
            mapped.put("description", rs.getString("description"));
            return mapped;
        });
    }

    @GetMapping("/{id}")
    public Map<String, Object> getBlockById(@PathVariable UUID id) {
        List<Map<String, Object>> blocks = jdbcTemplate.query("""
                SELECT h.*, u.name AS warden_name, u.phone AS warden_phone, u.email AS warden_email
                FROM hostel_blocks h
                LEFT JOIN users u ON h.warden_user_id = u.id
                WHERE h.id = :id
                """, new MapSqlParameterSource("id", id), (rs, rowNum) -> {
            boolean isApproved = rs.getString("approval_status") == null || "Approved".equals(rs.getString("approval_status"));

            List<Map<String, Object>> reviews = isApproved ? jdbcTemplate.query("""
                    SELECT r.*, u.name AS student_name
                    FROM reviews r
                    LEFT JOIN students s ON r.student_id = s.id
                    LEFT JOIN users u ON s.user_id = u.id
                    WHERE r.hostel_block_id = :id
                    ORDER BY r.created_at DESC
                    """, new MapSqlParameterSource("id", id), (reviewRs, reviewRow) -> {
                Map<String, Object> review = new LinkedHashMap<>();
                review.put("_id", reviewRs.getObject("id", UUID.class));
                review.put("studentId", reviewRs.getString("student_name") != null ? reviewRs.getString("student_name") : "Anonymous");
                review.put("rating", reviewRs.getInt("rating"));
                review.put("reviewText", reviewRs.getString("review_text"));
                review.put("helpful", reviewRs.getInt("helpful"));
                review.put("createdAt", reviewRs.getTimestamp("created_at"));
                review.put("photos", List.of());
                return review;
            }) : List.of();

            int totalRooms = rs.getInt("total_rooms");
            int availableRooms = rs.getInt("available_rooms");
            int occupiedRooms = rs.getObject("occupied_rooms") == null ? totalRooms - availableRooms : rs.getInt("occupied_rooms");
            List<Map<String, Object>> rooms = new ArrayList<>();
            for (int i = 0; i < totalRooms; i++) {
                boolean full = i < occupiedRooms;
                rooms.add(Map.of(
                        "roomNumber", String.valueOf(101 + i),
                        "status", full ? "Full" : "Available",
                        "occupants", full ? 2 : 0,
                        "capacity", 2
                ));
            }

            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("blockName", rs.getString("block_name"));
            mapped.put("type", rs.getString("type"));
            mapped.put("description", rs.getString("description"));
            mapped.put("totalRooms", totalRooms);
            mapped.put("availableRooms", availableRooms);
            mapped.put("occupiedRooms", occupiedRooms);
            mapped.put("location", rs.getString("location"));
            mapped.put("rating", isApproved ? rs.getBigDecimal("rating") : 0);
            mapped.put("virtualTourUrl", rs.getString("virtual_tour_url"));
            mapped.put("images", rs.getArray("images") == null ? List.of() : List.of((String[]) rs.getArray("images").getArray()));
            mapped.put("facilities", rs.getArray("facilities") == null ? List.of() : List.of((String[]) rs.getArray("facilities").getArray()));
            mapped.put("approvalStatus", rs.getString("approval_status") != null ? rs.getString("approval_status") : "Approved");
            mapped.put("wardenInfo", Map.of(
                    "name", rs.getString("warden_name") != null ? rs.getString("warden_name") : "N/A",
                    "phone", rs.getString("warden_phone") != null ? rs.getString("warden_phone") : "N/A",
                    "email", rs.getString("warden_email") != null ? rs.getString("warden_email") : "N/A"
            ));
            mapped.put("reviews", reviews);
            mapped.put("averageRating", isApproved ? rs.getBigDecimal("rating") : 0);
            mapped.put("totalReviews", reviews.size());
            mapped.put("rooms", rooms);
            return mapped;
        });

        if (blocks.isEmpty()) {
            throw new IllegalArgumentException("Hostel block not found");
        }
        return blocks.get(0);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateBlock(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE hostel_blocks
                SET block_name = COALESCE(:blockName, block_name),
                    description = COALESCE(:description, description),
                    updated_at = NOW()
                WHERE id = :id
                RETURNING *
                """;

        List<Map<String, Object>> rows = jdbcTemplate.query(sql, new MapSqlParameterSource()
                .addValue("blockName", body.get("blockName"))
                .addValue("description", body.get("description"))
                .addValue("id", id), (rs, rowNum) -> {
            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("blockName", rs.getString("block_name"));
            mapped.put("description", rs.getString("description"));
            return mapped;
        });

        if (rows.isEmpty()) {
            throw new IllegalArgumentException("Not found");
        }
        return rows.get(0);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteBlock(@PathVariable UUID id) {
        Integer count = jdbcTemplate.update("DELETE FROM hostel_blocks WHERE id = :id", new MapSqlParameterSource("id", id));
        if (count == null || count == 0) {
            throw new IllegalArgumentException("Not found");
        }
        return Map.of("success", true, "message", "Block deleted");
    }

    private Map<String, Object> mapHostelBlockSummary(java.sql.ResultSet rs) throws java.sql.SQLException {
        Map<String, Object> mapped = new LinkedHashMap<>();
        mapped.put("_id", rs.getObject("id", UUID.class));
        mapped.put("blockName", rs.getString("block_name"));
        mapped.put("type", rs.getString("type"));
        mapped.put("description", rs.getString("description"));
        mapped.put("totalRooms", rs.getInt("total_rooms"));
        mapped.put("availableRooms", rs.getInt("available_rooms"));
        mapped.put("occupiedRooms", rs.getInt("occupied_rooms"));
        mapped.put("location", rs.getString("location"));
        mapped.put("rating", rs.getBigDecimal("rating"));
        mapped.put("virtualTourUrl", rs.getString("virtual_tour_url"));
        mapped.put("images", rs.getArray("images") == null ? List.of() : List.of((String[]) rs.getArray("images").getArray()));
        mapped.put("facilities", rs.getArray("facilities") == null ? List.of() : List.of((String[]) rs.getArray("facilities").getArray()));
        mapped.put("wardenInfo", Map.of(
                "name", rs.getString("warden_name") != null ? rs.getString("warden_name") : "Assigned Warden",
                "phone", rs.getString("warden_phone") != null ? rs.getString("warden_phone") : "N/A"
        ));
        return mapped;
    }

    private String toArrayLiteral(String[] values) {
        if (values == null || values.length == 0) {
            return "{}";
        }
        StringBuilder builder = new StringBuilder("{");
        for (int i = 0; i < values.length; i++) {
            if (i > 0) {
                builder.append(",");
            }
            builder.append("\"").append(values[i].replace("\"", "\\\"")).append("\"");
        }
        builder.append("}");
        return builder.toString();
    }
}
