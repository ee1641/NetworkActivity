package edu.rit.NetworkActivity.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import edu.rit.NetworkActivity.data.entity.Post;
import edu.rit.NetworkActivity.data.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {

    @Mock PostRepository postRepository;
    @InjectMocks PostController postController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .findAndRegisterModules();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
    }

    // ── GET /api/posts ────────────────────────────────────────────────────────

    @Test
    void getPostsReturnsListOfPosts() throws Exception {
        when(postRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(makePost(1L, "Hello", "World")));

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Hello"));
    }

    @Test
    void getPostsWithRangeFiltersResults() throws Exception {
        when(postRepository.findByCreatedAtAfterOrderByCreatedAtDesc(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/posts").param("range", "24h"))
                .andExpect(status().isOk());

        verify(postRepository).findByCreatedAtAfterOrderByCreatedAtDesc(any());
    }

    // ── GET /api/posts/{id} ───────────────────────────────────────────────────

    @Test
    void getPostByIdReturnsPost() throws Exception {
        when(postRepository.findById(1L)).thenReturn(Optional.of(makePost(1L, "Hello", "World")));

        mockMvc.perform(get("/api/posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Hello"));
    }

    @Test
    void getPostByIdReturns404WhenNotFound() throws Exception {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/posts/99"))
                .andExpect(status().isNotFound());
    }

    // ── POST /api/posts ───────────────────────────────────────────────────────

    @Test
    void createPostReturns201WithSavedPost() throws Exception {
        Post saved = makePost(5L, "New Post", "Content here");
        when(postRepository.save(any(Post.class))).thenReturn(saved);

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New Post\",\"content\":\"Content here\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.title").value("New Post"));
    }

    // ── PUT /api/posts/{id} ───────────────────────────────────────────────────

    @Test
    void updatePostReturnsUpdatedPost() throws Exception {
        Post existing = makePost(1L, "Old Title", "Old Content");
        Post saved    = makePost(1L, "New Title", "Old Content");

        when(postRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(postRepository.save(any(Post.class))).thenReturn(saved);

        mockMvc.perform(put("/api/posts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New Title\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Title"));
    }

    @Test
    void updatePostReturns404WhenNotFound() throws Exception {
        when(postRepository.findById(eq(99L))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/posts/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"x\",\"content\":\"y\"}"))
                .andExpect(status().isNotFound());
    }

    // ── DELETE /api/posts/{id} ────────────────────────────────────────────────

    @Test
    void deletePostReturns204() throws Exception {
        when(postRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/posts/1"))
                .andExpect(status().isNoContent());

        verify(postRepository).deleteById(1L);
    }

    @Test
    void deletePostReturns404WhenNotFound() throws Exception {
        when(postRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/posts/99"))
                .andExpect(status().isNotFound());
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private Post makePost(Long id, String title, String content) {
        Post p = new Post();
        p.setId(id);
        p.setTitle(title);
        p.setContent(content);
        p.setCreatedAt(OffsetDateTime.now());
        return p;
    }
}
