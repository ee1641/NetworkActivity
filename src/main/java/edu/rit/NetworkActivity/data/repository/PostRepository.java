package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Find posts created after a specific date, ordered by newest first
    List<Post> findByCreatedAtAfterOrderByCreatedAtDesc(OffsetDateTime since);

    // Find all posts ordered by newest first
    List<Post> findAllByOrderByCreatedAtDesc();
}
