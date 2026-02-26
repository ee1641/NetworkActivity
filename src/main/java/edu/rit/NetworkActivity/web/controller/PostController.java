package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.Post;
import edu.rit.NetworkActivity.data.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /** GET /api/posts?range=24h|7d|30d|all */
    @GetMapping
    public List<Post> getPosts(@RequestParam(required = false) String range) {
        if (range == null || range.equals("all")) {
            return postRepository.findAllByOrderByCreatedAtDesc();
        }
        OffsetDateTime since = calculateSinceDate(range);
        return postRepository.findByCreatedAtAfterOrderByCreatedAtDesc(since);
    }

    /** GET /api/posts/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** POST /api/posts */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Post createPost(@RequestBody Post post) {
        post.setId(null);
        if (post.getCreatedAt() == null) {
            post.setCreatedAt(OffsetDateTime.now());
        }
        return postRepository.save(post);
    }

    /** PUT /api/posts/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post updates) {
        Optional<Post> existing = postRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Post post = existing.get();
        if (updates.getTitle() != null)   post.setTitle(updates.getTitle());
        if (updates.getContent() != null) post.setContent(updates.getContent());
        return ResponseEntity.ok(postRepository.save(post));
    }

    /** DELETE /api/posts/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
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
