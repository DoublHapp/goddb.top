package com.goddb.comment.dto;

import java.util.List;

public record CommentListResponse(
        List<CommentResponse> items,
        long total
) {
}
