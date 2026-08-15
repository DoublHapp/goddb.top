# 网站搬迁记：从 Vercel 到自建服务器

网站的终点不该是别人的服务器，也不该是自己的服务器——而应该是一套"搬家成本极低"的架构。这篇文章记录 goddb.top 从 Vercel 搬到自建服务器的完整过程：测速选型、Docker 化、HTTPS、安全加固、CI/CD，以及一路踩过的四个坑。

## 为什么搬家

goddb.top 原本托管在 Vercel 上，用一个静态 Vue 3 前端跑得很好。但最近有个更大的计划：把网站做成前后端完备的项目，前端 Vue + TS，后端 Spring Boot，Redis、消息队列、Docker 一整套都用上。Vercel 适合纯前端，可一旦需要常驻后端和中间件，自由度和成本都会成为问题。

另外一个朴素的理由：**想要"这个东西是我的"的感觉**。一台能随时 SSH 进去、能自己装东西的服务器，和黑盒托管是两种心境。

于是决定搬家。目标很明确：

- 选一台国内访问稳定的服务器
- 架构一步到位：Docker Compose 全栈骨架，为后端和中间件预留位置
- 以后换服务器，迁移成本要足够低

## 选型与测速

服务器选了 VMISS 的香港套餐（4 核 / 8G 内存 / 80G SSD / 1000Mbps 端口 / 月 5000G 流量），系统装 Ubuntu 24.04 LTS。选择逻辑很简单：香港机房离国内近，延迟低；优化线路晚高峰更稳；Ubuntu 24 支持周期长、软件生态成熟。

机器到手先做了三件测速：

1. **延迟与丢包**：本地 `ping`，平均约 43ms，零丢包，波动极小。这是最基础也最关键的一关。
2. **回程带宽**：在服务器上跑 Ookla 测速，下载 4.3Gbps、上传 6.5Gbps。虽然这是机房内速度，但说明硬件和带宽标称没有虚报。
3. **国内实测**：在服务器上用 nginx 放一个 100MB 文件，从本地电脑下载，实测约 10.8 MB/s（约 86 Mbps）。对一个加载量在几 MB 的静态站来说，这个速度意味着秒开。

结论：**完全够用**。顺带说一句，测速用的临时文件和临时 nginx 在验收完成后要记得清理，别让测试产物留在生产机上。

## 架构决策：Docker Compose 全栈骨架

这是本次迁移最重要的一个决定。网站现在还是纯静态，但未来会有 Spring Boot、Redis、MQ。如果现在用"系统装 nginx + 手动部署"的老办法，以后上后端还得推倒重来。

所以一开始就建 Docker Compose 全栈骨架：

```
nginx（前端静态文件 + /api 反向代理）
  └── backend（Spring Boot，profile 预留）
        ├── redis（缓存）
        └── rabbitmq（消息队列）
```

- **nginx 容器**托管前端 `dist` 目录（bind mount），SPA 路由回退、静态资源缓存、gzip 压缩，`/api/` 反向代理到后端
- **redis、rabbitmq 容器**现在就拉起，后端接入时零改动
- **backend 服务**用 `profiles` 标记预留，镜像就绪后一条命令启用

这个骨架的收益在以后：加后端只是往 compose 文件里填服务，**换服务器 = 拷贝 deploy 目录 + `docker compose up -d`**。

## 部署实录

前端构建在服务器本地完成（Node 22）：

```bash
git clone <repo> /opt/goddb
cd frontend && npm ci && npm run build
cp -r dist/* ../deploy/dist/
cd ../deploy && docker compose up -d
```

三条容器（nginx/redis/rabbitmq）一次拉起，网站通过 IP 直接可访问。至此迁移完成大半。

## 踩坑记录（值得沉淀的四个坑）

### 坑一：Node 版本与 lock 文件不兼容

服务器用 apt 装 Node 18，跑 `npm ci` 时报 `Missing: esbuild@0.28.2 from lock file`，还带着一堆 `EBADENGINE` 警告。排查后真相是：

- 项目的 devDependencies 里 `vitest@4` 内部嵌套依赖 `vite@8`，而 vite 8 把 `esbuild` 放到了 peerDependencies
- 本地 npm 11 生成的 lock 文件缺了 esbuild 0.28.2 条目，npm 11 宽松能过，npm 10 严格校验就报错

修复：把 `esbuild@^0.28.2` 显式声明进 devDependencies，lock 补齐，同时服务器升级到 Node 22。最终结构是根目录 esbuild 0.28.2（给 vite 8 用）+ vite 5 自己的嵌套 esbuild 0.21.5，互不干扰。

**教训：lock 文件要跟 Node/npm 版本匹配，跨版本跑 `npm ci` 前先确认引擎要求。**

### 坑二：nginx 启动即崩溃

docker compose 起来后，nginx 容器反复重启，日志写着：

```
[emerg] host not found in upstream "backend"
```

原因很直白：nginx.conf 里 `/api/` 反代指向 `backend` 容器，但 backend 还没部署（profile 预留），nginx 启动时解析 upstream 失败就退出了。

修复：让 nginx **运行时解析**而非启动时解析：

```nginx
location /api/ {
    resolver 127.0.0.11 valid=30s;
    set $backend_addr backend;
    proxy_pass http://$backend_addr:8080;
}
```

后端没上线时 `/api` 返回 502，nginx 正常启动；后端上线后自动联通，配置都不用改。

**教训：反向代理到"将来才有的服务"时，用 resolver + 变量做延迟解析。**

### 坑三：改完 nginx.conf 不生效

配置改了、`nginx -t` 通过了、reload 也执行了，但容器里 `cat` 出来还是旧配置，80 端口照样不重定向。

原因：git 更新文件时替换了 inode，而 Docker **绑定挂载单个文件**时，容器内仍指向旧 inode。`docker compose up -d` 因为 compose 文件没变显示 "Running"，根本没重建。

修复：`docker compose up -d --force-recreate nginx`。

**教训：bind mount 单文件 + git 更新，记得强制重建容器。**

### 坑四：GitHub Actions 密钥传递

自动部署时，SSH 私钥作为 secret 传给部署 action，报 `ssh: no key found`——私钥被"复制"坏了。排查到最后发现：多行 PEM 私钥经过终端/聊天工具复制，容易丢换行、被截断。

修复思路是**消灭复制**：

1. 服务器生成专用部署密钥
2. `base64 -w0` 编码成单行字符串存进 GitHub secret
3. workflow 里解码 + `grep "BEGIN OPENSSH"` 自检，再传给 scp action

单行 base64 基本不可能复制坏。中途还踩了两个小坑：密钥文件写到 `/tmp` 但 scp 是独立容器看不到（要写到共享的工作区目录）、文件权限 600 导致容器内读不了（改 644）。

**教训：多行敏感内容跨系统传递，先编码成单行，再加自检。**

## HTTPS 与 DNS 切换

HTTPS 用 Let's Encrypt + certbot webroot 模式。关键前提：**先把 DNS 切到新服务器再签证书**，否则域名验证找不到服务器。

DNS 在 Cloudflare 管理。切换时有一个容易忽略的细节：**必须关闭代理（灰云，DNS only）**，否则 Let's Encrypt 的 HTTP 验证会被 CDN 缓存干扰。

证书签好后接入 nginx（443 监听 + 80 自动 301），并配置了续期 hook——证书 90 天过期，续期成功后自动把新证书复制到 nginx 挂载目录并热重载。`certbot renew --dry-run` 演练一次确认链路可用。

## 安全加固

服务器裸奔是不行的，做了三层：

1. **防火墙**：ufw 只放行 22/80/443，默认拒绝其他入站
2. **防爆破**：fail2ban 监控 sshd，同一 IP 10 分钟内失败 5 次封禁 1 小时
3. **密钥登录**：每台设备各自生成 ed25519 密钥对，公钥加入服务器 `authorized_keys`。私钥永远不出本机，多设备互不冲突

有个插曲：这台服务器的镜像默认 `PubkeyAuthentication no`，密钥认证被直接禁用了——这是很少见的默认配置，改成 `yes` 后密钥才能生效。等所有设备都配好密钥后，再把密码登录关掉，爆破就彻底没戏了。

## 自动部署：push 即上线

最后一步是 CI/CD。GitHub Actions 工作流：

```
push 到 main（改动 frontend/）→ Node 22 构建 → npm ci → build
→ 解码部署密钥（自检）→ scp 上传 dist 到服务器 → nginx 实时生效
```

以后改代码只需要 `git push origin main`，一两分钟后线上就是新版本。这个 workflow 也设计成模板：以后新增小工具、小游戏，复制模板、改部署路径、用独立密钥，就能接入同一套自动部署。

## 成果与后续

搬家完成后的最终状态：

- 网站全站 HTTPS，运行在自建服务器
- Docker Compose 全栈骨架就位，redis/rabbitmq 已在跑
- GitHub Actions 自动部署，push 即上线
- 防火墙 + fail2ban + 密钥登录，基础安全到位
- 证书自动续期、服务开机自启，日常零维护

这次迁移最大的收获不是"网站变快了"，而是**沉淀了一套可复用的部署资产**：Docker 编排、nginx 配置、CI/CD 模板、排障手册。它们都进了仓库，换服务器、加新站点，照着手册走就行。

后续计划：Spring Boot 后端接入（骨架已就位）、API 网关与数据持久化、更多小工具站点入驻这套部署流水线。

如果这篇文章对你有点用，推荐把其中四个坑的教训记下来——它们各自都值一次深夜排查。
