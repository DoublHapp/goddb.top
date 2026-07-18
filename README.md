# goddb.top

DB 放小工具、随笔和一些不肯删掉的实验的地方。认真不是访问本站的前置条件，但项目维护说明仍然会认真写。项目采用单仓库双目录结构：

- `frontend/`：Vue 3 + Vite + TypeScript + Element Plus 网站前端
- `backend/`：Spring Boot 后端预留说明，首版不部署

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

## 生产构建

```bash
cd frontend
npm run build
```

Vercel 应将 Root Directory 设置为 `frontend`，通过 GitHub 推送自动部署。域名 `goddb.top` 与 `www.goddb.top` 在 Vercel 添加后，按 Vercel 给出的记录配置 Cloudflare DNS。

## 内容结构

网站以 Tools 与 Essays 组织主要公开内容，并以 DB宇宙展示游戏、小说、动漫、剪辑、合法资源和吐槽等兴趣成分。Tools 数据位于 `frontend/src/content/tools.ts`，公开路由为 `/tools`；每项工具通过 `subdomain` 声明独立子域名，主站保留 `/tools/:slug` 目录详情入口。Essays 正文位于 `frontend/src/content/posts/`，公开路由为 `/essays`。DB宇宙元数据位于 `frontend/src/content/dbverse.ts`，Markdown 位于 `frontend/src/content/dbverse/`，公开路由为 `/dbverse`。项目与个人档案数据位于 `frontend/src/content/index.ts`，本地化界面文案位于 `frontend/src/locales/messages.ts`。

新增工具或文章时同步维护 `frontend/public/sitemap.xml`。公开内容可以替换和扩展，但不要提交平台令牌、私钥或其他敏感信息。

DB宇宙使用 `section`、`mood` 和 `q` 同步目录筛选，正文中文优先。视频仅允许 Bilibili/YouTube 白名单嵌入；资源只允许 DB 原创、官方、开源或明确授权内容，并必须标注来源和授权。当前条目是明确标记的待投喂骨架，不包含虚假视频或下载链接。

## 主题与交互

网站提供中英双语与明暗双主题，首次访问跟随系统偏好，手动选择会被保存。工具收藏与最近访问分别使用 `goddb:favourite-tools` 和 `goddb:recent-tools`，存储值仅接受已登记工具的 slug。Essays 使用 `kind` 与 `q` 查询参数同步文章类型和搜索条件，`/blog` 及详情重定向时保留查询参数与 hash。文章代码和链接复制失败时会显示本地化反馈。

首页 Canvas 在桌面端使用 70 个节点、移动端使用 28 个节点，DPR 上限为 2；页面不可见时暂停，启用 reduced motion 时降级为静态画面。

## 发布

当需要上线时，可以请求使用 `site-release` Skill。它会先执行状态检查、Lint、类型检查和生产构建，再展示变更摘要；Git 提交和推送前必须获得确认。Vercel 使用 `frontend` 作为 Root Directory，构建命令为 `npm run build`，输出目录为 `dist`。

