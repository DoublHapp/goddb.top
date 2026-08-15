package com.goddb.comment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "nickname is required")
        @Size(max = 64, message = "nickname must be at most 64 characters")
        String nickname,

        @Email(message = "email must be a valid address")
        @Size(max = 255, message = "email must be at most 255 characters")
        String email,

        @NotBlank(message = "content is required")
        @Size(min = 1, max = 5000, message = "content must be between 1 and 5000 characters")
        String content,

        Long parentId
) {
}
