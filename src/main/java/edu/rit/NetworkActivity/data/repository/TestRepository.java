package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, Long> {
}

