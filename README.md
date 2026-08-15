# goddb.top

DB 放小工具、随笔和一些不肯删掉的实验的地方。认真不是访问本站的前置条件，但项目维护说明仍然会认真写。项目采用单仓库双目录结构：

- `frontend/`：Vue 3 + Vite + TypeScript + Element Plus 网站前端
- `backend/`：Spring Boot 3 + PostgreSQL 17 后端（评论区等动态 API，Docker Compose profile 启用）

## 本地开发

```bash
# 前端
cd frontend
npm install
npm run dev

# 后端（需 Docker 启动 PostgreSQL；无 Docker 时跳过，前端评论会显示加载失败）
cd deploy && docker compose up -d postgres
cd ../backend && mvn spring-boot:run
```

前端 `vite` 已配置 `/api` 代理到 `http://localhost:8080`，前后端联调无需 CORS 配置。

## 生产构建

```bash
cd frontend
npm run build
```

推送 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建前端 `dist` 并 scp 到自建服务器（VMISS），随后 SSH 执行 `docker compose --profile backend up -d --build postgres backend` 部署后端。无需手动部署；发布流程参考 `site-release` Skill，AI 协作规范见 `AGENTS.md`。

## 技术栈与版本

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

> 版本来源：`frontend/package.json`、`backend/pom.xml`、`deploy/docker-compose.yml`。变更依赖时同步更新本表。

## 内容结构

网站以 Tools 与 Essays 组织主要公开内容，并以 DB宇宙展示游戏、小说、动漫、剪辑、合法资源和吐槽等兴趣成分。Tools 数据位于 `frontend/src/content/tools.ts`，公开路由为 `/tools`；每项工具通过 `subdomain` 声明独立子域名，主站保留 `/tools/:slug` 目录详情入口。Essays 正文位于 `frontend/src/content/posts/`，公开路由为 `/essays`。DB宇宙元数据位于 `frontend/src/content/dbverse.ts`，Markdown 位于 `frontend/src/content/dbverse/`，公开路由为 `/dbverse`。项目与个人档案数据位于 `frontend/src/content/index.ts`，本地化界面文案位于 `frontend/src/locales/messages.ts`。

新增工具或文章时同步维护 `frontend/public/sitemap.xml`。公开内容可以替换和扩展，但不要提交平台令牌、私钥或其他敏感信息。

DB宇宙使用 `section`、`mood` 和 `q` 同步目录筛选，正文中文优先。视频仅允许 Bilibili/YouTube 白名单嵌入；资源只允许 DB 原创、官方、开源或明确授权内容，并必须标注来源和授权。当前放映室已有两条正式发布的视频，其余条目仍是明确标记的待投喂骨架，不包含虚假视频或下载链接。

真实平台视频必须同时登记平台、视频 ID、canonical 原视频 URL 和创作者署名。网站不抓取或重新托管平台视频；大体积本地视频不进入 Git 仓库。随笔 Markdown 使用 marked 解析并由 DOMPurify 清洗，中文正文可在英文界面明确回退；学习存档通过免责声明标记可能过时或有误。完整商业游戏文件不属于可发布资源。

## 主题与交互

网站提供中英双语与明暗双主题，首次访问跟随系统偏好，手动选择会被保存。工具收藏与最近访问分别使用 `goddb:favourite-tools` 和 `goddb:recent-tools`，存储值仅接受已登记工具的 slug。Essays 使用 `kind` 与 `q` 查询参数同步文章类型和搜索条件，`/blog` 及详情重定向时保留查询参数与 hash。文章代码和链接复制失败时会显示本地化反馈。

首页 Canvas 在桌面端使用 70 个节点、移动端使用 28 个节点，DPR 上限为 2；页面不可见时暂停，启用 reduced motion 时降级为静态画面。

## 发布

当需要上线时，可以请求使用 `site-release` Skill。它会先执行状态检查、Lint、类型检查和生产构建，再展示变更摘要；Git 提交和推送前必须获得确认。推送 `main` 后由 GitHub Actions 自动部署到自建服务器（VMISS），无需任何第三方托管平台。AI 协作与注释规范见根目录 `AGENTS.md`。

