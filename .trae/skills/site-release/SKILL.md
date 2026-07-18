---
name: "site-release"
description: "检查并发布 goddb.top 前端到 GitHub/Vercel。用户要求部署、上线、发布网站或同步到 Vercel 时调用。"
---

# goddb.top 发布助手

用于将 `goddb.top` 的前端变更安全地发布到 GitHub `main` 分支，并由 Vercel 自动部署。只在用户明确提出“发布网站”“部署”“上线”“同步到 Vercel”或“准备生产发布”时调用。

## 项目约定

- 仓库根目录：`c:\goddb.top`
- 前端目录：`frontend`
- 生产分支：`main`
- 远程仓库：`origin`
- Vercel Root Directory：`frontend`
- 构建命令：`npm run build`
- 输出目录：`dist`

## 执行流程

1. 确认当前工作目录为仓库根目录，并读取 Git 状态、当前分支、远程地址和最近提交。
2. 检查是否存在未跟踪的 `.env`、密钥、令牌、证书或其他敏感文件；发现时停止发布并提示移除。
3. 确认当前分支为 `main`。如果不是，停止并让用户决定是否切换，禁止自动覆盖其他分支。
4. 检查 `frontend/package.json` 与 `frontend/package-lock.json` 是否一致；必要时在 `frontend` 执行 `npm install`。
5. 依次执行：

   ```powershell
   npm run lint
   npm run check
   npm run build
   ```

6. 检查 `frontend/dist/index.html`、静态资源和 Vercel 配置是否存在。
7. 汇总变更文件、质量检查结果、构建结果和预期 Vercel 配置，向用户展示发布摘要。
8. 在 `git add`、`git commit` 和 `git push` 前请求用户确认。未获得确认时只报告结果，不执行 Git 发布。
9. 获得确认后，使用清晰的提交信息创建提交，并执行 `git push -u origin main`；如果已设置上游则执行 `git push`。
10. 发布后提示用户在 Vercel 检查部署状态、Build Logs、`goddb.top`、`www.goddb.top`、HTTPS、深链接和分享元数据。

## 安全规则

- 永远不执行 `git push --force`、`git reset --hard` 或删除远程分支。
- 永远不提交 `.env`、访问令牌、API 密钥、Cookie、私钥或 Cloudflare/Vercel 凭据。
- 不在输出、提交信息或日志中打印敏感值。
- 不自动修改 Cloudflare DNS、Vercel 项目设置或域名记录。
- 不绕过用户确认执行提交和推送。
- 如果工作区有用户未提交的修改，不擅自覆盖、暂存或丢弃这些修改。

## 失败处理

- 依赖安装、Lint、类型检查或生产构建失败时停止，不提交也不推送，并报告失败命令和日志摘要。
- 推送出现网络错误时，保留本地提交，提示用户检查网络、代理和 GitHub 访问，不重复强制推送。
- 推送出现远程领先或历史分叉时，先执行只读的 `git fetch origin` 和历史检查，再给出合并方案，不自动重写历史。
- Vercel 构建失败时，提示查看部署的 Build Logs，对照 Root Directory、Build Command 和 Output Directory 检查。

## 回滚指导

- 已提交但未推送：使用 `git revert <commit>` 或在用户明确要求后安全调整本地提交。
- 已推送到 GitHub：优先使用 `git revert <commit>` 创建反向提交，再按正常确认流程推送。
- Vercel 已部署：在 Vercel Deployments 中选择已知正常的旧部署并执行 Promote，然后再修复代码。
- 禁止使用 force push 作为常规回滚方式。
