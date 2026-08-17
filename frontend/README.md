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
- 新首页组件：`src/components/PhantomIntro.vue`、`PhantomEyeMark.vue`、`PhantomHero.vue`、`ChannelGrid.vue`、`LatestDispatches.vue` 与 `MissionPanel.vue`
- 主题和全局交互：`src/composables/` 与 `src/style.css`
- SEO 基础：`index.html`、`public/sitemap.xml` 与 `public/robots.txt`

Post 的 `kind` 为 `daily | inspiration | technical`，现有文章使用 `technical`。Essays 通过 `kind` 与 `q` 查询参数同步筛选状态；`/blog` 及其文章地址重定向至 `/essays` 时保留 query 与 hash。剪贴板操作提供完整的中英文成功和失败反馈。新增公开内容时需要同步更新 sitemap。

DB宇宙分为游戏、书架、番剧、放映室、资源堆和吐槽墙，通过 `section`、`mood` 与 `q` 查询参数筛选。详情正文中文优先，英文正文缺失时明确回退中文。视频只接受 Bilibili/YouTube 平台与受控 video ID；资源仅允许原创、官方、开源或明确授权内容，并且必须同时记录来源与授权。当前放映室已有两条正式发布的视频，其余五条内容仍为“等待 DB 投喂”的骨架，不代表真实下载资源或完成观点。

真实视频使用 `platform + videoId + sourceUrl + creator` 注册；`sourceUrl` 必须是去除分享参数后的原平台地址。网站只嵌入平台播放器并保留原视频入口，不抓取或重新托管视频。大体积视频不进入 Git 仓库，应先上传 Bilibili 或对象存储。

Markdown 由 `marked` 解析并经 `DOMPurify` 白名单清洗，不允许绕过清洗直接将内容 HTML 写入 DOM。随笔正文允许中文必填、英文可选；英文缺失时显示明确回退提示。`learningArchive` 会显示学习存档免责声明，长文目录由 h2/h3 自动生成。完整商业游戏文件不得作为资源上传。

每项工具在 `subdomain` 字段声明独立子域名，主站 `/tools/:slug` 提供目录与详情入口。收藏和最近访问分别保存到 `goddb:favourite-tools` 与 `goddb:recent-tools`，读取与写入仅接受工具数据中存在的 slug。

首页采用“替身头版”信息结构：原创裂屏开场将 D/B 几何瞳孔收束为常驻 DB 双眼标识，随后依次展示品牌主视觉、随笔/DB宇宙/项目频道格、本期真实内容与频道任务面板。首页、开场、声音及眼标文案统一维护在 `messages.ts` 的 `home.phantom`、`home.opening`、`home.sound` 与 `home.eyeMark`，中英文键必须保持一致。

开场同一标签页会话只自动播放一次，可通过眼标或重播按钮再次播放，并支持点击跳过和 Escape。声音首次访问默认关闭，选择持久化到本地；低动态模式保留全部内容，以静态双眼定格和淡入替代裂屏运动。原创眼标、开场与提示音不得使用或仿制第三方角色、Logo、字体、原声或解包资产。

## 部署

推送 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）自动执行 `npm run build`，将 `dist` 上传到自建服务器（VMISS）由 nginx 托管，无需任何第三方托管平台；完整技术栈版本见根目录 README 的"技术栈与版本"表。项目根目录的 `site-release` Skill 会在发布前执行检查，并在推送到 `main` 前请求确认。
