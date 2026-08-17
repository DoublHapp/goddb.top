# AGENTS.md — goddb.top 开发指南

本文件面向 AI 与协作者，是接管本仓库开发前的必读文档。遇到与本文不一致的代码，以本文与各目录 README 为准。

## 1. 项目概览

goddb.top 是 DB 的个人网站（小工具、随笔、DB宇宙等），单仓库三目录：

- `frontend/`：Vue 3 + TypeScript 双语静态站（Vite 构建，产物 `dist`）
- `backend/`：Spring Boot API 服务（当前为随笔评论区 MVP），MyBatis-Plus + Flyway + PostgreSQL
- `deploy/`：自建服务器部署配置（Docker Compose 编排 + nginx 反代 + certbot 证书）

仓库根：`c:\the_website_of_DB\goddb.top`，生产分支 `main`。部署由 GitHub Actions 自动完成（push `main` 触发），运行于自建服务器（VMISS），不依赖任何第三方托管平台。

## 2. 技术栈与版本

> 本表与根 `README.md` 的"技术栈与版本"同步维护，变更依赖时必须同时更新两处。

| 层 | 技术 | 版本 |
|---:|---|---|
| 前端 | Node.js（CI/构建） | 22 |
| 前端 | Vue / Vue Router | 3.4 / 4.2 |
| 前端 | Vite / TypeScript | 5 / 5.3 |
| 前端 | Element Plus | 2.9 |
| 前端 | Tailwind CSS | 3.4 |
| 前端 | Three.js | 0.185 |
| 前端 | Vitest / Playwright | 4 / 1.62 |
| 后端 | JDK / Maven | 17 / 3.6.3 |
| 后端 | Spring Boot | 3.3.5 |
| 后端 | MyBatis-Plus | 3.5.7 |
| 后端 | Flyway / SpringDoc | 内置 / 2.6.0 |
| 后端 | Actuator | 内置 |
| 数据库 | PostgreSQL | 17 |
| 部署 | Docker Compose 服务 | nginx 1.27 / postgres 17 / redis 7 / rabbitmq 3.13 |
| 部署 | GitHub Actions | push main 自动部署 |

## 3. 目录结构速览

```
frontend/
  src/
    content/       # 内容数据与 Markdown（posts/、dbverse/、tools.ts、index.ts）
    components/    # Vue 组件（PostComments.vue 等）
    composables/   # 组合式函数（useLocale/useTheme/useSeo...）
    lib/           # 纯逻辑工具（api.ts、markdown.ts、clipboard.ts、dbverse/...）
    locales/       # 中英文案 messages.ts
    pages/         # 路由页面
    router/        # Vue Router 配置
    styles/        # 全局样式
    types/         # 内容类型定义
  public/          # 静态资源（favicon、sitemap.xml、robots.txt）
  e2e/             # Playwright 端到端测试
backend/
  src/main/java/com/goddb/
    comment/       # 评论领域（实体、Mapper、Service、Controller、DTO）
    admin/         # 管理接口（Bearer Token 删除评论）
    health/        # /api/health
    common/        # ApiException、全局异常处理
  src/main/resources/
    db/migration/  # Flyway 迁移（V1__create_comments.sql）
    application.yml
deploy/
  docker-compose.yml  # nginx/backend(postgres/redis/rabbitmq 编排)
  nginx.conf          # SPA 回退 + /api 运行时反代
  .env.example        # POSTGRES_PASSWORD / GODDB_ADMIN_TOKEN 模板
.github/workflows/deploy.yml  # 自动部署 CI
scripts/upload-r2.mjs          # Cloudflare R2 媒体上传（零依赖 SigV4）
```

首页采用“替身头版”结构：`PhantomIntro` 负责原创裂屏开场，`PhantomEyeMark` 提供收束后的常驻 DB 双眼标识，`PhantomHero` 承载品牌主视觉，随后由频道格、最新内容和任务面板组织整站入口。相关双语文案集中在 `locales/messages.ts` 的 `home.phantom`、`home.opening`、`home.sound` 与 `home.eyeMark`；修改任一语言时必须同步另一语言并保持递归键结构一致。

开场同一标签页会话只自动播放一次，允许眼标或重播控件手动重播，并支持跳过与 Escape；声音默认关闭并持久化选择，提示音仅使用 Web Audio 即时合成。`prefers-reduced-motion: reduce` 下必须保留完整内容，以静态定格和淡入替代裂屏运动。眼标、开场视觉及声音均须使用原创或明确授权资产，不得复制第三方角色、Logo、字体、原声或解包资源。

## 4. 常用命令

```bash
# 前端
cd frontend
npm install          # 安装依赖（提交前需与 package-lock.json 一致）
npm run dev          # 本地开发（/api 代理到 localhost:8080）
npm run lint         # ESLint
npm run check        # vue-tsc 类型检查 + 构建
npm run build        # 生产构建（产物 dist/）
npm run test:run     # Vitest 单测

# 后端
cd backend
mvn spring-boot:run  # 本地启动（需先启动 PostgreSQL）
mvn test             # 单测 + 集成测试（无 Docker 时集成测试自动跳过）
mvn package          # 打包 jar

# 部署（本地 PostgreSQL，供后端联调）
cd deploy
docker compose up -d postgres
# 后端就绪后的完整启停：
docker compose --profile backend up -d --build postgres backend
```

## 5. AI 协作约定（必读）

### 5.1 注释规范（强制）

AI 生成或修改的代码**必须**添加标准注释，目标是"自解释 + 规范性"：

- **前端（TypeScript / Vue）**：类、函数、组件 props/emits、公共 API 使用 **JSDoc**（`/** ... */`），说明用途、参数、返回值；关键逻辑补充行内注释。
- **后端（Java）**：类、方法、公共接口使用 **JavaDoc**（`/** ... */`），说明用途、参数（`@param`）、返回值（`@return`）；复杂逻辑补充行内注释。
- 注释语言与所在文件的现有风格保持一致（现有代码中英混用，跟随该文件）。

### 5.2 密钥安全

- 绝不提交 `.env*`（含 `.env.r2.local`）、`GODDB_ADMIN_TOKEN`、R2 凭据、SSH 私钥、证书密钥或任何真实令牌。
- 示例/模板值必须是假占位符（参考 `deploy/.env.example`）。
- 新增密钥类文件时，确认 `.gitignore` 已覆盖（根 `.gitignore` 已忽略 `.env.*`、`.vercel/`、`target/` 等）。

### 5.3 测试先行

- 修复 bug 前，先编写能复现该 bug 的测试。
- 新增功能尽量补充测试：前端用 Vitest（`frontend/src/**/*.test.ts`），后端用 JUnit + Testcontainers（参考 `CommentServiceTest`、`CommentApiIntegrationTest`）。

### 5.4 文档同步

以下变更必须同步更新对应文档，否则视为未完成：

- 技术栈/依赖变更 → 根 `README.md` 与本文第 2 节版本表、对应目录 README
- 后端 API 契约 → `backend/README.md` 的 API 契约段
- 前端路由/内容结构/新增公开内容 → 对应目录 README、`frontend/public/sitemap.xml`
- 部署/编排变更 → `deploy/README.md`、`deploy/docker-compose.yml` 头部注释

### 5.5 依赖变更

新增依赖前先说明理由并获确认；依赖确定引入后更新版本总表。不随意升级大版本（如 Vue 4、Spring Boot 4、Vite 6）除非用户明确要求。

### 5.6 发布流程

- 部署由 GitHub Actions 自动完成（push `main` 即触发 `.github/workflows/deploy.yml`）。
- 发布相关操作参考 `site-release` Skill：**commit 与 push 前必须获得用户确认**。
- 发布后验证：`https://goddb.top/api/actuator/health` 返回 UP、`/api/swagger-ui.html` 可访问、评论区可提交。

## 6. 部署概览

push `main` → GitHub Actions：前端 `npm ci && npm run build` → scp `dist` 到 VMISS 服务器 → SSH `docker compose --profile backend up -d --build postgres backend`。后端依赖 `deploy/.env`（`POSTGRES_PASSWORD`、`GODDB_ADMIN_TOKEN`），由 nginx `/api` 运行时反代到 `backend:8080`。
