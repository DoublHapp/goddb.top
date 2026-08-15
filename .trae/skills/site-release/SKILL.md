---
name: "site-release"
description: "检查并发布 goddb.top 到 GitHub main，由 GitHub Actions 自动部署到自建服务器（VMISS）。用户要求部署、上线、发布网站时调用。"
---

# goddb.top 发布助手

用于将 `goddb.top` 的变更安全地发布到 GitHub `main` 分支，由 GitHub Actions 自动构建并部署到自建服务器（VMISS，Ubuntu + Docker Compose）。只在用户明确提出"发布网站""部署""上线"或"准备生产发布"时调用。

## 项目约定

- 仓库根目录：`c:\the_website_of_DB\goddb.top`
- 前端目录：`frontend`
- 后端目录：`backend`
- 部署目录：`deploy`（docker-compose.yml + nginx.conf）
- 生产分支：`main`
- 远程仓库：`origin`
- 构建命令：前端 `npm run build`（在 `frontend` 下执行）；后端由服务器上 Docker 构建
- 输出目录：`frontend/dist`
- 部署机制：GitHub Actions（`.github/workflows/deploy.yml`）——push `main` 后自动构建前端 dist 并 scp 到服务器，再 SSH 执行 `docker compose --profile backend up -d --build postgres backend`

## 执行流程

1. 确认当前工作目录为仓库根目录，并读取 Git 状态、当前分支、远程地址和最近提交。
2. 检查是否存在未跟踪的 `.env`、密钥、令牌、证书或其他敏感文件；发现时停止发布并提示移除。
3. 确认当前分支为 `main`。如果不是，停止并让用户决定是否切换，禁止自动覆盖其他分支。
4. 检查 `frontend/package.json` 与 `frontend/package-lock.json` 是否一致；必要时在 `frontend` 执行 `npm install`。
5. 依次执行：

   ```powershell
   cd frontend
   npm run lint
   npm run check
   npm run build
   ```

6. 检查 `frontend/dist/index.html` 与静态资源是否存在。
7. 汇总变更文件、质量检查结果和构建结果，向用户展示发布摘要。
8. 在 `git add`、`git commit` 和 `git push` 前请求用户确认。未获得确认时只报告结果，不执行 Git 发布。
9. 获得确认后，使用清晰的提交信息创建提交，并执行 `git push -u origin main`；如果已设置上游则执行 `git push`。
10. 发布后提示用户在 GitHub Actions（仓库 Actions 页）查看 `Deploy goddb.top to VMISS` 运行状态，并在部署完成后检查：
    - `goddb.top` / `www.goddb.top`、HTTPS 证书
    - 健康检查 `https://goddb.top/api/actuator/health` 返回 UP
    - Swagger UI `https://goddb.top/api/swagger-ui.html` 可访问
    - 随笔评论区可正常加载与提交

## 安全规则

- 永远不执行 `git push --force`、`git reset --hard` 或删除远程分支。
- 永远不提交 `.env`、访问令牌、API 密钥、Cookie、私钥或 R2/服务器凭据。
- 不在输出、提交信息或日志中打印敏感值。
- 不自动修改服务器 DNS、防火墙或部署编排之外的配置。
- 不绕过用户确认执行提交和推送。
- 如果工作区有用户未提交的修改，不擅自覆盖、暂存或丢弃这些修改。

## 失败处理

- 依赖安装、Lint、类型检查或生产构建失败时停止，不提交也不推送，并报告失败命令和日志摘要。
- 推送出现网络错误时，保留本地提交，提示用户检查网络、代理和 GitHub 访问，不重复强制推送。
- 推送出现远程领先或历史分叉时，先执行只读的 `git fetch origin` 和历史检查，再给出合并方案，不自动重写历史。
- GitHub Actions 构建失败时，提示查看 Actions 日志（对应 job 的 Build/Deploy 步骤），对照 secrets（`GODDB_SSH_KEY_B64`、`GODDB_SERVER_HOST`、`GODDB_SERVER_USER`）与构建命令检查。
- 后端容器启动失败时，提示在服务器 `docker compose logs backend` 查看日志，并检查 `deploy/.env` 中 `POSTGRES_PASSWORD`、`GODDB_ADMIN_TOKEN` 是否就绪。

## 回滚指导

- 已提交但未推送：使用 `git revert <commit>` 或在用户明确要求后安全调整本地提交。
- 已推送到 GitHub：优先使用 `git revert <commit>` 创建反向提交，再按正常确认流程推送；CI 会自动重新部署。
- 线上回滚：使用 `git revert` 让 GitHub Actions 重新部署旧行为；若需立即恢复，可在服务器重新构建上一版本镜像（`docker compose --profile backend up -d --build`）后观察，具体步骤与用户确认。
- 禁止使用 force push 作为常规回滚方式。
