package com.goddb.admin;

import com.goddb.comment.CommentService;
import com.goddb.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class AdminController {

    private final CommentService commentService;

    @Value("${goddb.admin-token}")
    private String adminToken;

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,
                       @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (adminToken == null || adminToken.isBlank() || !matches(adminToken, bearerToken(authorization))) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "invalid admin token");
        }
        commentService.delete(id);
    }

    private String bearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return "";
        }
        return authorization.substring("Bearer ".length()).trim();
    }

    private boolean matches(String expected, String actual) {
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] actualBytes = actual.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(expectedBytes, actualBytes);
    }
}
