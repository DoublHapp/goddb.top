# goddb.top 部署手册

本目录存放 goddb.top 的自建服务器部署配置（Docker Compose 编排 + nginx 配置）。站点已从 Vercel 迁移到自建服务器（Ubuntu 24.04 + Docker），并接入 GitHub Actions 自动部署。

> 本文档中的 `<SERVER_IP>` 均为占位符，请替换为实际服务器 IP。任何密钥、密码与凭据都不应写入本仓库。

## 架构总览

```
                    ┌─────────────────────────┐
  用户 ──443──▶  nginx 容器（前端静态文件 + 反向代理）
                    │      │ /api 转发
                    │      ▼
                    │  spring-boot 容器（预留，profile 启用）
                    │      │
                    │      ├──▶ redis 容器（缓存）
                    │      └──▶ rabbitmq 容器（消息队列）
                    └─────────▶ （数据库按需接入）
```

- **nginx**：端口 `80/443`；托管 `dist/` 静态文件（bind mount），SPA 路由 `try_files` 回退，`/api/` 运行时解析反代到 `backend:8080`
- **backend**：Spring Boot 预留服务，`profiles: ["backend"]` 默认不启动，就绪后 `docker compose --profile backend up -d --build`
- **redis**：内部网络，仅容器间访问，`appendonly` 持久化到卷
- **rabbitmq**：`5672` 仅内部网络；管理台 `15672` 只绑定 `127.0.0.1`（本机 SSH 隧道访问）
- 数据卷：`redis-data`、`rabbitmq-data`（`docker volume` 管理）

## 服务器初始化

Ubuntu 24.04 安装完成后：

```bash
# 1. 系统更新
apt update && apt upgrade -y && apt install -y curl wget git ufw

# 2. 安装 Docker + Compose
curl -fsSL https://get.docker.com | sh && systemctl enable --now docker && docker compose version

# 3. 安装 Node 22（仅用于构建前端，官方二进制装到 /usr/local）
curl -fsSL https://nodejs.org/dist/latest-v22.x/ -o /tmp/node-list.html
# 或直接用固定版本（示例）：
cd /tmp && curl -fsSL https://nodejs.org/dist/v22.22.2/node-v22.22.2-linux-x64.tar.xz -o node22.tar.xz \
  && tar -xJf node22.tar.xz -C /usr/local --strip-components=1 && hash -r && node -v && npm -v

# 4. 防火墙：仅放行 SSH / HTTP / HTTPS（顺序重要，先放行 22 再 enable）
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable && ufw status verbose
```

## 首次部署

```bash
# 1. 克隆仓库（部署配置在本仓库 deploy/ 目录）
mkdir -p /opt/goddb && git clone https://github.com/DoublHapp/goddb.top.git /opt/goddb

# 2. 构建前端
cd /opt/goddb/frontend && npm ci && npm run build

# 3. 放入 deploy/dist（nginx bind mount 目录）
mkdir -p /opt/goddb/deploy/dist && rm -rf /opt/goddb/deploy/dist/* && cp -r /opt/goddb/frontend/dist/* /opt/goddb/deploy/dist/

# 4. 启动容器
cd /opt/goddb/deploy && docker compose up -d

# 5. 验证
docker ps   # nginx/redis/rabbitmq 应为 Up
curl -I http://<SERVER_IP>/
```

## HTTPS（Let's Encrypt）

1. 先在 DNS 处将域名 A 记录指向 `<SERVER_IP>`（**关闭 CDN 代理**，否则验证会被缓存干扰）
2. 本目录 nginx.conf 已包含 `/.well-known/acme-challenge/` 验证路径（挂载 `/opt/goddb/deploy/certbot`）

```bash
apt install -y certbot
cd /opt/goddb/deploy && mkdir -p certs certbot && docker compose up -d
certbot certonly --webroot -w /opt/goddb/deploy/certbot -d goddb.top -d www.goddb.top \
  --agree-tos --no-eff-email --register-unsafely-without-email
```

3. 复制证书到 nginx 挂载目录并重载：

```bash
cp /etc/letsencrypt/live/goddb.top/fullchain.pem /opt/goddb/deploy/certs/fullchain.pem
cp /etc/letsencrypt/live/goddb.top/privkey.pem /opt/goddb/deploy/certs/privkey.pem
chmod 644 /opt/goddb/deploy/certs/fullchain.pem /opt/goddb/deploy/certs/privkey.pem
docker compose up -d --force-recreate nginx
```

> nginx.conf 修改后如未生效，用 `docker compose up -d --force-recreate nginx` 强制重建（git 更新文件会替换 inode，bind mount 单文件可能仍指向旧 inode）。

4. **自动续期 hook**（续期成功后复制新证书并热重载）：

```bash
mkdir -p /etc/letsencrypt/renewal-hooks/deploy && cat > /etc/letsencrypt/renewal-hooks/deploy/goddb.sh << 'EOF'
#!/bin/bash
cp /etc/letsencrypt/live/goddb.top/fullchain.pem /opt/goddb/deploy/certs/fullchain.pem
cp /etc/letsencrypt/live/goddb.top/privkey.pem /opt/goddb/deploy/certs/privkey.pem
chmod 644 /opt/goddb/deploy/certs/fullchain.pem /opt/goddb/deploy/certs/privkey.pem
docker exec goddb-nginx nginx -s reload 2>/dev/null || true
EOF
chmod +x /etc/letsencrypt/renewal-hooks/deploy/goddb.sh && certbot renew --dry-run
```

## 安全加固

```bash
# fail2ban 防 SSH 爆破
apt install -y fail2ban
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
[sshd]
enabled = true
backend = systemd
EOF
systemctl enable --now fail2ban && systemctl restart fail2ban && fail2ban-client status sshd
```

**SSH 密钥登录（多设备）**：每台设备各自生成密钥对，公钥追加到服务器 `authorized_keys`（`>>` 追加）：

```bash
# 本地生成（示例：Windows PowerShell / Mac）
ssh-keygen -t ed25519 -C "PC-名称"
# 把公钥内容粘贴到服务器（在已连接会话中执行）
echo "ssh-ed25519 AAAA... 注释" >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
```

注意：部分镜像默认 `PubkeyAuthentication no`，需开启：

```bash
sed -i 's/^PubkeyAuthentication no/PubkeyAuthentication yes/' /etc/ssh/sshd_config && sshd -t && systemctl restart ssh
```

全部设备密钥就绪后可禁用密码登录：

```bash
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config \
  && sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config \
  && sshd -t && systemctl restart ssh
```

## 日常更新与 CI/CD

### 自动部署（推荐）

`.github/workflows/deploy.yml`：push 到 `main` 且改动 `frontend/**` 时触发 → 云端 Node 22 构建 → scp 上传 `dist` 到服务器 `/opt/goddb/deploy/dist/`（nginx bind mount 实时生效）。

仓库 Secrets（GitHub → Settings → Secrets and variables → Actions）：

| Secret | 说明 |
|---|---|
| `GODDB_SERVER_HOST` | 服务器 IP |
| `GODDB_SERVER_USER` | 部署 SSH 用户（如 root） |
| `GODDB_SSH_KEY_B64` | 部署密钥私钥的 **base64 单行**（`base64 -w0 ~/.ssh/deploy_key` 生成） |

> 部署密钥在服务器生成：`ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""`，公钥加入 `authorized_keys`。私钥用 base64 单行存 secret，避免多行复制损坏。

### 手动更新

```bash
cd /opt/goddb && git pull && cd frontend && npm ci && npm run build \
  && rm -rf ../deploy/dist/* && cp -r dist/* ../deploy/dist/ && cd ../deploy && docker compose up -d
```

## 多站点扩展规范

一台服务器可承载多个站点/工具/游戏：

1. 每站点独立 GitHub 仓库，复制本仓库 `.github/workflows/deploy.yml` 模板（改上传路径）
2. 每站点独立目录：`/opt/sites/<project>/`（`dist`、`nginx.conf`、`docker-compose.yml`）
3. 每站点**独立部署密钥**（一个仓库泄露不影响其他站点）
4. nginx 统一入口：新增虚拟主机 `server_name <sub>.goddb.top`，各站点 `include` 配置
5. redis / rabbitmq 等中间件可共用（部署在 `/opt/goddb/deploy`）

## 换服务器迁移 Checklist

1. 备份服务器上 `/opt/goddb/deploy/`（含 `dist`、`certs`、`docker-compose.yml`、`nginx.conf`）
2. 新服务器执行「服务器初始化」步骤
3. 拷贝备份的 `deploy/` 目录到新机 `/opt/goddb/deploy/`
4. `docker compose up -d` 拉起全部服务
5. DNS 把域名切到新服务器 IP（关 CDN 代理）
6. 若域名 IP 变化，重新签发/续期证书（`certbot` 自动处理，必要时 `certbot renew`）
7. 更新 GitHub Secrets 中 `GODDB_SERVER_HOST`（多服务器时每台一套 secret）

## 排障速查

| 现象 | 原因 | 处理 |
|---|---|---|
| nginx 容器反复重启，日志 `host not found in upstream "backend"` | 后端未启动，nginx 启动时解析 upstream 失败 | `/api/` 用 `resolver 127.0.0.11 + set $backend_addr` 运行时解析 |
| 改完 nginx.conf 不生效 | git 更新替换 inode，bind mount 单文件仍指向旧 inode | `docker compose up -d --force-recreate nginx` |
| 服务器 `npm ci` 报 `Missing: esbuild@0.28.2` | 旧 npm 解析 lock 与 package.json 不一致（vitest 4 依赖 vite 8 的 esbuild peer） | 在 devDependencies 显式声明 `esbuild`；用 Node 22+ 配套 npm |
| Actions 部署报 `ssh: no key found` | secret 中私钥被复制损坏（丢换行/截断） | 用 `base64 -w0` 单行存 secret，workflow 中解码 + `BEGIN OPENSSH` 自检 |
| Actions 报 `permission denied` 读密钥文件 | scp 容器用户与文件 owner 不一致 | 工作区内密钥文件 `chmod 644` |
| Actions 报 `/tmp/goddb_deploy_key: no such file` | scp 是独立容器，看不到 runner 的 `/tmp` | 密钥写到 `$GITHUB_WORKSPACE` 并用 `key_path: ${{ github.workspace }}/...` |

## 重启自检

重启服务器后确认：

```bash
systemctl is-enabled docker fail2ban certbot.timer
docker ps   # 容器 restart 策略为 unless-stopped，自动恢复
```
