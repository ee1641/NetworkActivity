package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.Post;
import edu.rit.NetworkActivity.data.repository.PostRepository;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private static final Logger log = LoggerFactory.getLogger(PostController.class);
    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /**
     * GET /api/posts?range=24h|7d|30d|all&page=0&size=20
     *
     * Returns a paginated list of posts, newest first.
     */
    @GetMapping
    public Page<Post> getPosts(
            @RequestParam(required = false) String range,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int safeSize = Math.min(size, 100);
        PageRequest pageable = PageRequest.of(page, safeSize, Sort.by("createdAt").descending());
        Page<Post> result;
        if (range == null || range.equals("all")) {
            result = postRepository.findAll(pageable);
        } else {
            OffsetDateTime since = calculateSinceDate(range);
            result = postRepository.findByCreatedAtAfter(since, pageable);
        }
        LogStrategy.info(log, LogEvents.API_POST_LIST,
                "range", range, "page", page, "size", safeSize,
                "totalElements", result.getTotalElements());
        return result;
    }

    /** GET /api/posts/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        Optional<Post> found = postRepository.findById(id);
        if (found.isEmpty()) {
            LogStrategy.warn(log, LogEvents.API_POST_NOT_FOUND, "id", id);
            return ResponseEntity.notFound().build();
        }
        LogStrategy.info(log, LogEvents.API_POST_GET, "id", id);
        return ResponseEntity.ok(found.get());
    }

    /** POST /api/posts */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Post createPost(@RequestBody Post post) {
        post.setId(null);
        if (post.getCreatedAt() == null) {
            post.setCreatedAt(OffsetDateTime.now());
        }
        Post saved = postRepository.save(post);
        LogStrategy.info(log, LogEvents.API_POST_CREATE, "id", saved.getId(), "title", saved.getTitle());
        return saved;
    }

    /** PUT /api/posts/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post updates) {
        Optional<Post> existing = postRepository.findById(id);
        if (existing.isEmpty()) {
            LogStrategy.warn(log, LogEvents.API_POST_NOT_FOUND, "id", id);
            return ResponseEntity.notFound().build();
        }
        Post post = existing.get();
        if (updates.getTitle()   != null) post.setTitle(updates.getTitle());
        if (updates.getContent() != null) post.setContent(updates.getContent());
        Post saved = postRepository.save(post);
        LogStrategy.info(log, LogEvents.API_POST_UPDATE, "id", id);
        return ResponseEntity.ok(saved);
    }

    /** DELETE /api/posts/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            LogStrategy.warn(log, LogEvents.API_POST_NOT_FOUND, "id", id);
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        LogStrategy.info(log, LogEvents.API_POST_DELETE, "id", id);
        return ResponseEntity.noContent().build();
    }

    private OffsetDateTime calculateSinceDate(String range) {
        OffsetDateTime now = OffsetDateTime.now();
        return switch (range) {
            case "24h" -> now.minusHours(24);
            case "7d"  -> now.minusDays(7);
            case "30d" -> now.minusDays(30);
            default    -> OffsetDateTime.MIN;
        };
    }
}
