CREATE TABLE comments (
    id          BIGSERIAL PRIMARY KEY,
    post_slug   VARCHAR(128) NOT NULL,
    parent_id   BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    nickname    VARCHAR(64)  NOT NULL,
    email       VARCHAR(255),
    content     TEXT         NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
    status      VARCHAR(16)  NOT NULL DEFAULT 'published',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments (post_slug, created_at);
