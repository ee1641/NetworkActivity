package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
