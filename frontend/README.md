# goddb.top 前端

goddb.top 是 DB 放小工具、随笔和一些不肯删掉的实验的地方。本目录包含由 Vue 3、TypeScript、Vite、Vue Router 与 Element Plus 构建的双语前端。

GitHub：https://github.com/DoublHapp/goddb.top

## 命令

```bash
npm install
npm run dev
npm run lint
npm run check
npm run build
```

## 内容与路由

- Tools 数据：`src/content/tools.ts`，公开路由为 `/tools`
- Essays Markdown：`src/content/posts/`，元数据定义于 `src/content/index.ts`，公开路由为 `/essays`
- DB宇宙：元数据位于 `src/content/dbverse.ts`，Markdown 位于 `src/content/dbverse/`，公开路由为 `/dbverse`
- 项目与档案数据：`src/content/index.ts`
- 中英文本地化：`src/locales/messages.ts`
- 页面：`src/pages/`
- 主题和全局交互：`src/composables/` 与 `src/style.css`
- SEO 基础：`index.html`、`public/sitemap.xml` 与 `public/robots.txt`

Post 的 `kind` 为 `daily | inspiration | technical`，现有文章使用 `technical`。Essays 通过 `kind` 与 `q` 查询参数同步筛选状态；`/blog` 及其文章地址重定向至 `/essays` 时保留 query 与 hash。剪贴板操作提供完整的中英文成功和失败反馈。新增公开内容时需要同步更新 sitemap。

DB宇宙分为游戏、书架、番剧、放映室、资源堆和吐槽墙，通过 `section`、`mood` 与 `q` 查询参数筛选。详情正文中文优先，英文正文缺失时明确回退中文。视频只接受 Bilibili/YouTube 平台与受控 video ID；资源仅允许原创、官方、开源或明确授权内容，并且必须同时记录来源与授权。当前六条内容均为“等待 DB 投喂”的骨架，不代表真实视频、下载资源或完成观点。

每项工具在 `subdomain` 字段声明独立子域名，主站 `/tools/:slug` 提供目录与详情入口。收藏和最近访问分别保存到 `goddb:favourite-tools` 与 `goddb:recent-tools`，读取与写入仅接受工具数据中存在的 slug。

Canvas 在桌面端绘制 70 个节点、移动端绘制 28 个节点，设备像素比最高取 2。页面不可见时暂停动画；系统启用 reduced motion 时保留静态画面，不启动连续帧循环。

## Vercel

- Root Directory：`frontend`
- Build Command：`npm run build`
- Output Directory：`dist`

项目根目录的 `site-release` Skill 会在发布前执行检查，并在推送到 `main` 前请求确认。
