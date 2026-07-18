# goddb.top

个人网站项目，采用单仓库双目录结构：

- `frontend/`：Vue 3 + Vite + TypeScript + Element Plus 前端
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

## 内容维护

项目内容位于 `frontend/src/content/projects/`，博客 Markdown 位于 `frontend/src/content/posts/`。真实个人信息、链接和文章可以替换示例内容，但不要提交平台令牌或其他敏感信息。

## 主题与交互

网站提供明暗双主题，首次访问跟随系统偏好，手动选择会被保存。项目页支持 `q` 和 `status` 查询参数，博客页支持 `q` 和 `category` 查询参数，筛选结果可以直接分享。

## 发布

当需要上线时，可以请求使用 `site-release` Skill。它会先执行状态检查、Lint、类型检查和生产构建，再展示变更摘要；Git 提交和推送前必须获得确认。Vercel 使用 `frontend` 作为 Root Directory，构建命令为 `npm run build`，输出目录为 `dist`。

