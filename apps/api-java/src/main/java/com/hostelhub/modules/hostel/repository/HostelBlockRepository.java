package com.hostelhub.modules.hostel.repository;

import com.hostelhub.modules.hostel.entity.HostelBlockEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HostelBlockRepository extends JpaRepository<HostelBlockEntity, UUID>, JpaSpecificationExecutor<HostelBlockEntity> {
}
