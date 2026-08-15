# goddb.top 后端（Spring Boot 3 + JDK 17 + MyBatis-Plus）

goddb.top 的 API 服务，为静态前端提供动态交互能力。当前已实现**随笔评论区 MVP**（匿名昵称 + 收集邮箱，暂不验证邮箱）。

## 技术栈

- JDK 17 · Spring Boot 3.3.5 · Maven 3.6.3
- MyBatis-Plus 3.5.7（Spring Boot 3 starter）+ Flyway 迁移
- SpringDoc OpenAPI 2.6.0（Swagger UI）· Spring Boot Actuator
- PostgreSQL 17（docker-compose 提供）

## 本地开发

```bash
# 1. 启动 PostgreSQL（docker compose 的 postgres 服务）
cd deploy && docker compose up -d postgres

# 2. 运行后端（默认连接 localhost:5432/goddb，用户名 goddb，密码可在 DB_PASSWORD 环境变量覆盖）
cd backend
mvn spring-boot:run
```

前端开发联调：`frontend/vite.config.ts` 已配置 `/api` 代理到 `http://localhost:8080`。

## API 契约

```
GET    /api/health                      → 200 { status: "UP" }
GET    /api/posts/{slug}/comments       → 200 { items: CommentResponse[], total }
POST   /api/posts/{slug}/comments       body: { nickname, email?, content, parentId? } → 201
DELETE /api/admin/comments/{id}         header: Authorization: Bearer <GODDB_ADMIN_TOKEN> → 204
```

## 运维与文档

- **Actuator**：端点挂在 `/api/actuator` 下（与 nginx `/api` 反代对齐），生产暴露 `health`、`info`、`metrics`：`GET /api/actuator/health`。
- **OpenAPI 文档（Swagger UI）**：`/api/swagger-ui.html`，JSON 规范在 `/api/v3/api-docs`。本地起后端后浏览器打开即可交互调试评论接口。

- `CommentResponse`：`{ id, postSlug, parentId, nickname, content, createdAt, replyCount }`
- 校验：nickname 1~64；content 1~5000；email 可选且需格式合法；parentId 必须属于同一篇随笔。
- 评论仅存纯文本，HTML 由前端 DOMPurify 清洗渲染。
- 管理删除接口使用环境变量 `GODDB_ADMIN_TOKEN`（Bearer Token）保护，未配置时拒绝所有删除请求。

## 测试

```bash
mvn test
```

- `CommentServiceTest`：纯单测（Mockito，mock MyBatis-Plus BaseMapper）。
- `CommentApiIntegrationTest`：Testcontainers 起真实 PostgreSQL 走 Flyway + MockMvc 全链路；本机无 Docker 时自动跳过，CI/服务器有 Docker 时运行。

## 生产部署

由 `deploy/docker-compose.yml` 编排：`docker compose --profile backend up -d --build`。GitHub Actions 推送后自动构建部署（见 `.github/workflows/deploy.yml`）。
