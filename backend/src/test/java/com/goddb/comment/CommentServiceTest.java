package com.goddb.comment;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.goddb.comment.dto.CommentListResponse;
import com.goddb.comment.dto.CommentRequest;
import com.goddb.comment.dto.CommentResponse;
import com.goddb.common.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository repository;

    private CommentService service;

    @BeforeEach
    void setUp() {
        service = new CommentService(repository);
    }

    @Test
    void listReturnsOnlyPublishedCommentsWithReplyCounts() {
        Comment root = comment(1L, "my-post", null, "alice", "hello", Instant.parse("2026-08-16T10:00:00Z"), "published");
        Comment reply = comment(2L, "my-post", 1L, "bob", "hi alice", Instant.parse("2026-08-16T10:05:00Z"), "published");
        Comment hidden = comment(3L, "my-post", null, "spam", "bad", Instant.parse("2026-08-16T10:06:00Z"), "deleted");
        when(repository.selectList(any(Wrapper.class))).thenReturn(List.of(root, reply, hidden));

        CommentListResponse response = service.list("my-post");

        assertThat(response.total()).isEqualTo(2);
        assertThat(response.items()).hasSize(2);
        CommentResponse rootResponse = response.items().get(0);
        assertThat(rootResponse.id()).isEqualTo(1L);
        assertThat(rootResponse.replyCount()).isEqualTo(1);
    }

    @Test
    void createSavesTrimmedContentAndDefaultsToPublished() {
        when(repository.insert(any(Comment.class))).thenAnswer(invocation -> {
            Comment comment = invocation.getArgument(0);
            comment.setId(10L);
            return 1;
        });

        CommentResponse response = service.create("my-post",
                new CommentRequest(" alice ", "alice@example.com", "  nice post  ", null));

        ArgumentCaptor<Comment> captor = ArgumentCaptor.forClass(Comment.class);
        verify(repository).insert(captor.capture());
        Comment saved = captor.getValue();
        assertThat(saved.getNickname()).isEqualTo("alice");
        assertThat(saved.getContent()).isEqualTo("nice post");
        assertThat(saved.getPostSlug()).isEqualTo("my-post");
        assertThat(saved.getStatus()).isEqualTo("published");
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
    }

    @Test
    void createRejectsParentFromAnotherPost() {
        when(repository.selectCount(any(Wrapper.class))).thenReturn(0L);

        assertThatThrownBy(() -> service.create("my-post",
                new CommentRequest("alice", null, "reply", 99L)))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("parent comment not found");
    }

    @Test
    void deleteThrowsWhenCommentDoesNotExist() {
        when(repository.selectById(42L)).thenReturn(null);

        assertThatThrownBy(() -> service.delete(42L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("comment not found");
    }

    @Test
    void deleteRemovesExistingComment() {
        when(repository.selectById(42L)).thenReturn(comment(42L, "p", null, "a", "c", Instant.now(), "published"));

        service.delete(42L);

        verify(repository).deleteById(42L);
    }

    private Comment comment(Long id, String postSlug, Long parentId, String nickname,
                            String content, Instant createdAt, String status) {
        Comment comment = new Comment();
        comment.setId(id);
        comment.setPostSlug(postSlug);
        comment.setParentId(parentId);
        comment.setNickname(nickname);
        comment.setContent(content);
        comment.setCreatedAt(createdAt);
        comment.setStatus(status);
        return comment;
    }
}
