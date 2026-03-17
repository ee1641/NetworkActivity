package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.Post;
import edu.rit.NetworkActivity.data.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PostControllerPaginationTest {

    @Mock PostRepository postRepository;
    @InjectMocks PostController postController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
    }

    private Post makePost(long id) {
        Post p = new Post();
        p.setId(id);
        p.setTitle("Post " + id);
        p.setContent("Content");
        p.setCreatedAt(OffsetDateTime.now());
        return p;
    }

    @Test
    void getPostsReturnsPaginatedResponse() throws Exception {
        List<Post> posts = List.of(makePost(1), makePost(2));
        Page<Post> page = new PageImpl<>(posts, PageRequest.of(0, 20), 50);
        when(postRepository.findAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/posts").param("page", "0").param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.totalElements").value(50))
                .andExpect(jsonPath("$.totalPages").value(3))
                .andExpect(jsonPath("$.number").value(0));
    }

    @Test
    void getPostsDefaultPageIsZeroSizeTwenty() throws Exception {
        Page<Post> page = new PageImpl<>(List.of(), PageRequest.of(0, 20), 0);
        when(postRepository.findAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk());

        verify(postRepository).findAll(argThat((Pageable p) ->
                p.getPageNumber() == 0 && p.getPageSize() == 20));
    }

    @Test
    void getPostsEnforcesSizeCapAt100() throws Exception {
        Page<Post> page = new PageImpl<>(List.of(), PageRequest.of(0, 100), 0);
        when(postRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Request size=9999 — should be capped at 100
        mockMvc.perform(get("/api/posts").param("size", "9999"))
                .andExpect(status().isOk());

        verify(postRepository).findAll(argThat((Pageable p) -> p.getPageSize() == 100));
    }

    @Test
    void getPostsWithRangeUsesFindByCreatedAtAfter() throws Exception {
        Page<Post> page = new PageImpl<>(List.of(), PageRequest.of(0, 20), 0);
        when(postRepository.findByCreatedAtAfter(any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/posts").param("range", "24h"))
                .andExpect(status().isOk());

        verify(postRepository).findByCreatedAtAfter(any(), any(Pageable.class));
    }
}
