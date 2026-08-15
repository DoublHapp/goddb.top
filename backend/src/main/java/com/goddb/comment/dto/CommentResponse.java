package com.goddb.comment.dto;

import java.time.Instant;

public record CommentResponse(
        Long id,
        String postSlug,
        Long parentId,
        String nickname,
        String content,
        Instant createdAt,
        long replyCount
) {
}
