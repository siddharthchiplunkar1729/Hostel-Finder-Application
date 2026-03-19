package com.hostelhub.modules.students.controller;

import com.hostelhub.security.AuthenticatedUser;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/students")
public class StudentController {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public StudentController(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getStudents(
            @RequestParam(required = false) String course,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) UUID blockId
    ) {
        StringBuilder sql = new StringBuilder("""
                SELECT s.*, u.name, u.email, u.phone, hb.block_name
                FROM students s
                JOIN users u ON s.user_id = u.id
                LEFT JOIN hostel_blocks hb ON s.hostel_block_id = hb.id
                WHERE 1 = 1
                """);
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (course != null && !course.isBlank()) {
            sql.append(" AND s.course = :course");
            params.addValue("course", course);
        }
        if (year != null) {
            sql.append(" AND s.year = :year");
            params.addValue("year", year);
        }
        if (blockId != null) {
            sql.append(" AND s.hostel_block_id = :blockId");
            params.addValue("blockId", blockId);
        }

        sql.append(" ORDER BY s.created_at DESC");

        return jdbcTemplate.query(sql.toString(), params, (rs, rowNum) -> {
            Map<String, Object> hostelInfo = null;
            UUID hostelBlockId = rs.getObject("hostel_block_id", UUID.class);
            if (hostelBlockId != null) {
                hostelInfo = Map.of(
                        "_id", hostelBlockId,
                        "blockName", rs.getString("block_name")
                );
            }

            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("userId", rs.getObject("user_id", UUID.class));
            mapped.put("rollNumber", rs.getString("roll_number"));
            mapped.put("course", rs.getString("course"));
            mapped.put("year", rs.getObject("year"));
            mapped.put("department", rs.getString("department"));
            mapped.put("hostelBlockId", hostelInfo);
            mapped.put("roomNumber", rs.getString("room_number"));
            mapped.put("enrollmentStatus", rs.getString("enrollment_status"));
            mapped.put("name", rs.getString("name"));
            mapped.put("email", rs.getString("email"));
            mapped.put("phone", rs.getString("phone"));
            return mapped;
        });
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createStudent(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO students (user_id, roll_number, course, year, department, hostel_block_id, room_number)
                VALUES (:userId, :rollNumber, :course, :year, :department, :hostelBlockId, :roomNumber)
                RETURNING *
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", body.get("userId"))
                .addValue("rollNumber", body.get("rollNumber"))
                .addValue("course", body.get("course"))
                .addValue("year", body.get("year"))
                .addValue("department", body.get("department"))
                .addValue("hostelBlockId", body.get("hostelBlockId"))
                .addValue("roomNumber", body.get("roomNumber"));

        return jdbcTemplate.query(sql, params, rs -> {
            if (!rs.next()) {
                throw new IllegalArgumentException("Failed to create student");
            }
            return mapSimpleStudent(rs);
        });
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','WARDEN','ADMIN')")
    public Map<String, Object> getStudentById(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser principal
    ) {
        if ("Student".equals(principal.getRole())) {
            ensureStudentOwnership(id, principal.getId(), "Unauthorized: You can only view your own profile");
        }

        String sql = """
                SELECT
                    s.*,
                    u.name, u.email, u.phone, u.role, u.can_access_dashboard,
                    hb.block_name, hb.location AS hostel_location
                FROM students s
                JOIN users u ON s.user_id = u.id
                LEFT JOIN hostel_blocks hb ON s.hostel_block_id = hb.id
                WHERE s.id = :id
                """;

        List<Map<String, Object>> results = jdbcTemplate.query(sql, new MapSqlParameterSource("id", id), (rs, rowNum) -> {
            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("userId", rs.getObject("user_id", UUID.class));
            mapped.put("name", rs.getString("name"));
            mapped.put("email", rs.getString("email"));
            mapped.put("phone", rs.getString("phone"));
            mapped.put("rollNumber", rs.getString("roll_number"));
            mapped.put("course", rs.getString("course"));
            mapped.put("year", rs.getObject("year"));
            mapped.put("department", rs.getString("department"));
            mapped.put("roomNumber", rs.getString("room_number"));
            mapped.put("enrollmentStatus", rs.getString("enrollment_status"));
            mapped.put("photo", rs.getString("photo"));
            mapped.put("canAccessDashboard", rs.getBoolean("can_access_dashboard"));
            UUID hostelBlockId = rs.getObject("hostel_block_id", UUID.class);
            mapped.put("hostelInfo", hostelBlockId == null ? null : Map.of(
                    "id", hostelBlockId,
                    "name", rs.getString("block_name"),
                    "location", rs.getString("hostel_location")
            ));
            mapped.put("feeStatus", Map.of(
                    "isPaid", "Active".equals(rs.getString("enrollment_status")),
                    "lastPayment", rs.getTimestamp("updated_at")
            ));
            return mapped;
        });

        if (results.isEmpty()) {
            throw new IllegalArgumentException("Student not found");
        }
        return results.get(0);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','WARDEN','ADMIN')")
    public Map<String, Object> updateStudentById(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser principal,
            @RequestBody Map<String, Object> body
    ) {
        ensureStudentOwnership(id, principal.getId(), "Unauthorized: You can only update your own profile");

        Map<String, String> allowedFields = Map.of(
                "rollNumber", "roll_number",
                "course", "course",
                "year", "year",
                "department", "department",
                "roomNumber", "room_number",
                "photo", "photo"
        );

        List<String> assignments = new ArrayList<>();
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);

        for (Map.Entry<String, Object> entry : body.entrySet()) {
            String column = allowedFields.get(entry.getKey());
            if (column != null) {
                assignments.add(column + " = :" + entry.getKey());
                params.addValue(entry.getKey(), entry.getValue());
            }
        }

        if (assignments.isEmpty()) {
            throw new IllegalArgumentException("No valid fields provided for update");
        }

        String sql = "UPDATE students SET " + String.join(", ", assignments) + ", updated_at = NOW() WHERE id = :id RETURNING *";

        return jdbcTemplate.query(sql, params, rs -> {
            if (!rs.next()) {
                throw new IllegalArgumentException("Student not found");
            }
            return mapSimpleStudent(rs);
        });
    }

    @GetMapping("/{id}/roommates")
    @PreAuthorize("hasRole('STUDENT')")
    public Map<String, Object> getRoommates(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser principal
    ) {
        ensureStudentOwnership(id, principal.getId(), "Unauthorized");

        String studentSql = "SELECT hostel_block_id, room_number FROM students WHERE id = :id";
        Map<String, Object> student = jdbcTemplate.query(studentSql, new MapSqlParameterSource("id", id), rs -> {
            if (!rs.next()) {
                return null;
            }
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("hostel_block_id", rs.getObject("hostel_block_id", UUID.class));
            data.put("room_number", rs.getString("room_number"));
            return data;
        });

        if (student == null || student.get("hostel_block_id") == null || student.get("room_number") == null) {
            return Map.of("success", true, "roommates", List.of());
        }

        String roommatesSql = """
                SELECT s.id, u.name, u.email, s.photo, s.course, s.year
                FROM students s
                JOIN users u ON s.user_id = u.id
                WHERE s.hostel_block_id = :hostelBlockId
                  AND s.room_number = :roomNumber
                  AND s.id != :studentId
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("hostelBlockId", student.get("hostel_block_id"))
                .addValue("roomNumber", student.get("room_number"))
                .addValue("studentId", id);

        List<Map<String, Object>> roommates = jdbcTemplate.query(roommatesSql, params, (rs, rowNum) -> {
            Map<String, Object> mapped = new LinkedHashMap<>();
            mapped.put("_id", rs.getObject("id", UUID.class));
            mapped.put("name", rs.getString("name"));
            mapped.put("email", rs.getString("email"));
            mapped.put("photo", rs.getString("photo"));
            mapped.put("course", rs.getString("course"));
            mapped.put("year", rs.getObject("year"));
            return mapped;
        });

        return Map.of("success", true, "roommates", roommates);
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('STUDENT')")
    public Map<String, Object> payStudentFees(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser principal
    ) {
        ensureStudentOwnership(id, principal.getId(), "Unauthorized: You cannot process payments for another student");

        String sql = """
                UPDATE students
                SET enrollment_status = 'Active', updated_at = NOW()
                WHERE id = :id
                RETURNING *
                """;

        Map<String, Object> student = jdbcTemplate.query(sql, new MapSqlParameterSource("id", id), rs -> {
            if (!rs.next()) {
                return null;
            }
            return mapSimpleStudent(rs);
        });

        if (student == null) {
            throw new IllegalArgumentException("Student not found");
        }

        return Map.of(
                "success", true,
                "message", "Payment verified successfully",
                "data", student
        );
    }

    private void ensureStudentOwnership(UUID studentId, UUID userId, String errorMessage) {
        String sql = "SELECT COUNT(*) FROM students WHERE id = :studentId AND user_id = :userId";
        Integer count = jdbcTemplate.queryForObject(
                sql,
                new MapSqlParameterSource()
                        .addValue("studentId", studentId)
                        .addValue("userId", userId),
                Integer.class
        );

        if (count == null || count == 0) {
            throw new IllegalArgumentException(errorMessage);
        }
    }

    private Map<String, Object> mapSimpleStudent(java.sql.ResultSet rs) throws java.sql.SQLException {
        Map<String, Object> mapped = new LinkedHashMap<>();
        mapped.put("_id", rs.getObject("id", UUID.class));
        mapped.put("id", rs.getObject("id", UUID.class));
        mapped.put("user_id", rs.getObject("user_id", UUID.class));
        mapped.put("roll_number", rs.getString("roll_number"));
        mapped.put("course", rs.getString("course"));
        mapped.put("year", rs.getObject("year"));
        mapped.put("department", rs.getString("department"));
        mapped.put("hostel_block_id", rs.getObject("hostel_block_id", UUID.class));
        mapped.put("room_number", rs.getString("room_number"));
        mapped.put("enrollment_status", rs.getString("enrollment_status"));
        mapped.put("photo", rs.getString("photo"));
        return mapped;
    }
}
