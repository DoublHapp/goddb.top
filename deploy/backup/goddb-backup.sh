#!/usr/bin/env bash
# goddb 数据库定时备份到 Cloudflare R2
#
# 依赖：
#   - rclone（服务器安装，remote 名为 r2，指向 goddb-media 桶）
#   - docker + goddb-postgres 容器
#
# R2 凭据只存服务器 rclone 配置（/root/.config/rclone/rclone.conf，mode 600），
# 绝不写入本仓库。安装与 cron 配置步骤见 deploy/README.md 的"数据库自动备份"。
set -euo pipefail

BACKUP_DIR="/var/backups/goddb"      # 本地临时备份目录
R2_PATH="r2:goddb-media/backups"     # R2 对象前缀：backups/goddb-<时间戳>.dump
KEEP_LOCAL_DAYS=3                    # 本地备份保留天数
KEEP_R2_DAYS=30                      # R2 备份保留天数

mkdir -p "$BACKUP_DIR"

TS=$(date +%Y%m%d-%H%M%S)
FILE="$BACKUP_DIR/goddb-$TS.dump"

# 1. pg_dump 自定义格式（自带压缩），从 postgres 容器内导出到本地
docker exec goddb-postgres pg_dump -U goddb -d goddb -Fc > "$FILE"

# 2. 上传到 R2（--s3-no-check-bucket 跳过 bucket 探测，R2 不支持该探测 API 会返回 501）
rclone --s3-no-check-bucket copyto "$FILE" "$R2_PATH/goddb-$TS.dump"

# 3. 清理本地超过保留期的备份文件
find "$BACKUP_DIR" -name 'goddb-*.dump' -mtime +"$KEEP_LOCAL_DAYS" -delete

# 4. 清理 R2 上超过保留期的备份（保留最近 30 天）
rclone --s3-no-check-bucket delete "$R2_PATH" --min-age "${KEEP_R2_DAYS}d" --include 'goddb-*.dump' --verbose 2>/dev/null || true
