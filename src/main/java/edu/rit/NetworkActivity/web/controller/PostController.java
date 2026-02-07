package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.Post;
import edu.rit.NetworkActivity.data.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Allow all for testing
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getPosts(@RequestParam(required = false) String range) {
        if (range == null || range.equals("all")) {
            return postRepository.findAllByOrderByCreatedAtDesc();
        }

        OffsetDateTime since = calculateSinceDate(range);
        return postRepository.findByCreatedAtAfterOrderByCreatedAtDesc(since);

    private OffsetDateTime calculateSinceDate(String range) {
        OffsetDateTime now = OffsetDateTime.now();

        return switch (range) {
            case "24h" -> now.minusHours(24);
            case "7d" -> now.minusDays(7);
            case "30d" -> now.minusDays(30);
            default -> OffsetDateTime.MIN; // Effectively "all"
        };
    }
}
