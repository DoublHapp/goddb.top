package com.goddb.comment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@EnabledIf("dockerAvailable")
@SuppressWarnings("resource")
class CommentApiIntegrationTest {

    private static final String ADMIN_TOKEN = "test-admin-token";

    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("goddb")
            .withUsername("goddb")
            .withPassword("goddb");

    static boolean dockerAvailable() {
        try {
            return DockerClientFactory.instance().isDockerAvailable();
        } catch (Throwable ignored) {
            return false;
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository repository;

    @BeforeAll
    static void startDatabase() {
        postgres.start();
    }

    @AfterAll
    static void stopDatabase() {
        postgres.stop();
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("goddb.admin-token", () -> ADMIN_TOKEN);
    }

    @BeforeEach
    void cleanUp() {
        repository.delete(null);
    }

    @Test
    void healthReturnsUp() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void emptyPostHasZeroComments() throws Exception {
        mockMvc.perform(get("/api/posts/empty-post/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty())
                .andExpect(jsonPath("$.total").value(0));
    }

    @Test
    void createAndListComment() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/posts/hello-world/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"alice","email":"alice@example.com","content":"nice post!"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.postSlug").value("hello-world"))
                .andExpect(jsonPath("$.nickname").value("alice"))
                .andExpect(jsonPath("$.replyCount").value(0))
                .andReturn();

        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        long commentId = body.get("id").asLong();

        mockMvc.perform(get("/api/posts/hello-world/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].id").value(commentId));
    }

    @Test
    void createReplyCountsUnderParent() throws Exception {
        MvcResult root = mockMvc.perform(post("/api/posts/topic/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"alice","content":"root"}
                                """))
                .andExpect(status().isCreated())
                .andReturn();
        long rootId = objectMapper.readTree(root.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(post("/api/posts/topic/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"bob","content":"reply","parentId":%d}
                                """.formatted(rootId)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/posts/topic/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(2))
                .andExpect(jsonPath("$.items[0].replyCount").value(1));
    }

    @Test
    void createRejectsInvalidInput() throws Exception {
        mockMvc.perform(post("/api/posts/hello-world/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"","content":""}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void createRejectsParentFromAnotherPost() throws Exception {
        mockMvc.perform(post("/api/posts/other-post/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"alice","content":"hi","parentId":999999}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteRequiresAdminToken() throws Exception {
        mockMvc.perform(post("/api/posts/token-post/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"alice","content":"to delete"}
                                """))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/admin/comments/1"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(delete("/api/admin/comments/1")
                        .header("Authorization", "Bearer wrong-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteWorksWithConfiguredToken() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/posts/token-post/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"alice","content":"to delete"}
                                """))
                .andExpect(status().isCreated())
                .andReturn();
        long commentId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(delete("/api/admin/comments/" + commentId)
                        .header("Authorization", "Bearer " + ADMIN_TOKEN))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/posts/token-post/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(0));
    }

    @Test
    void deleteMissingCommentReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/api/admin/comments/999999")
                        .header("Authorization", "Bearer " + ADMIN_TOKEN))
                .andExpect(status().isNotFound());
    }

    @Test
    void createdCommentOrderIsChronological() throws Exception {
        postComment("chrono-post", "first");
        postComment("chrono-post", "second");
        postComment("chrono-post", "third");

        mockMvc.perform(get("/api/posts/chrono-post/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].content").value("first"))
                .andExpect(jsonPath("$.items[1].content").value("second"))
                .andExpect(jsonPath("$.items[2].content").value("third"))
                .andExpect(jsonPath("$.total").value(3));
    }

    private long postComment(String slug, String content) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/posts/" + slug + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"alice","content":"%s"}
                                """.formatted(content)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }
}
