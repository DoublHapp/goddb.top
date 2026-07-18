# goddb.top 前端

Vue 3 + TypeScript + Vite + Vue Router + Element Plus 的双语个人网站前端。

## 命令

```bash
npm install
npm run dev
npm run lint
npm run check
npm run build
```

## 内容

- 项目数据：`src/content/index.ts`
- 博客 Markdown：`src/content/posts/`
- 页面：`src/pages/`
- 主题和全局交互：`src/composables/` 与 `src/style.css`

## Vercel

- Root Directory：`frontend`
- Build Command：`npm run build`
- Output Directory：`dist`

项目根目录的 `site-release` Skill 会在发布前执行检查，并在推送到 `main` 前请求确认。
