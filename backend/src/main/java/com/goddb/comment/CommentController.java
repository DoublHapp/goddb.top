package com.goddb.comment;

import com.goddb.comment.dto.CommentListResponse;
import com.goddb.comment.dto.CommentRequest;
import com.goddb.comment.dto.CommentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts/{slug}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public CommentListResponse list(@PathVariable String slug) {
        return commentService.list(slug);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse create(@PathVariable String slug, @Valid @RequestBody CommentRequest request) {
        return commentService.create(slug, request);
    }
}
