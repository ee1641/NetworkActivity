package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // ── unpaginated (kept for compatibility) ──────────────────────────────────
    List<Post> findByCreatedAtAfterOrderByCreatedAtDesc(OffsetDateTime since);
    List<Post> findAllByOrderByCreatedAtDesc();

    // ── paginated ─────────────────────────────────────────────────────────────
    Page<Post> findByCreatedAtAfter(OffsetDateTime since, Pageable pageable);
    Page<Post> findAll(Pageable pageable);
}
