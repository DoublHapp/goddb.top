package com.goddb.comment;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.goddb.comment.dto.CommentListResponse;
import com.goddb.comment.dto.CommentRequest;
import com.goddb.comment.dto.CommentResponse;
import com.goddb.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    public static final String STATUS_PUBLISHED = "published";

    private final CommentRepository repository;

    @Transactional(readOnly = true)
    public CommentListResponse list(String postSlug) {
        List<Comment> all = repository.selectList(new LambdaQueryWrapper<Comment>()
                .eq(Comment::getPostSlug, postSlug)
                .eq(Comment::getStatus, STATUS_PUBLISHED)
                .orderByAsc(Comment::getCreatedAt))
                .stream()
                .filter(comment -> STATUS_PUBLISHED.equals(comment.getStatus()))
                .toList();
        Map<Long, Long> replyCounts = all.stream()
                .filter(comment -> comment.getParentId() != null)
                .collect(Collectors.groupingBy(Comment::getParentId, Collectors.counting()));
        List<CommentResponse> items = all.stream()
                .map(comment -> toResponse(comment, replyCounts.getOrDefault(comment.getId(), 0L)))
                .toList();
        return new CommentListResponse(items, items.size());
    }

    @Transactional
    public CommentResponse create(String postSlug, CommentRequest request) {
        if (request.parentId() != null) {
            Long parentCount = repository.selectCount(new LambdaQueryWrapper<Comment>()
                    .eq(Comment::getPostSlug, postSlug)
                    .eq(Comment::getId, request.parentId()));
            if (parentCount == 0) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "parent comment not found for this post");
            }
        }
        Comment comment = new Comment();
        comment.setPostSlug(postSlug);
        comment.setParentId(request.parentId());
        comment.setNickname(request.nickname().trim());
        comment.setEmail(request.email());
        comment.setContent(request.content().trim());
        comment.setStatus(STATUS_PUBLISHED);
        comment.setCreatedAt(Instant.now());
        repository.insert(comment);
        return toResponse(comment, 0L);
    }

    @Transactional
    public void delete(Long id) {
        Comment existing = repository.selectById(id);
        if (existing == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "comment not found");
        }
        repository.deleteById(id);
    }

    private CommentResponse toResponse(Comment comment, long replyCount) {
        return new CommentResponse(
                comment.getId(),
                comment.getPostSlug(),
                comment.getParentId(),
                comment.getNickname(),
                comment.getContent(),
                comment.getCreatedAt(),
                replyCount
        );
    }
}
