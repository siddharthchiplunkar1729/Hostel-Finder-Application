package com.hostelhub.modules.students.repository;

import com.hostelhub.modules.students.entity.StudentEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<StudentEntity, UUID> {

    Optional<StudentEntity> findByUserId(UUID userId);

    boolean existsByRollNumber(String rollNumber);
}
