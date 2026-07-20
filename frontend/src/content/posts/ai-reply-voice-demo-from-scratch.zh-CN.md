# 零基础搭建 AI 回复语音 Demo

> **本期 idea 来自 zz 同学。**
>
> **副标题：** Windows 10/11 + Trae + GitHub + Vercel，从一句业务需求到可在线访问的“AI 回复 + MP3 语音”工作台
>
> **适用人群：** 没学过编程、第一次接触终端、GitHub、API 和部署的人。
>
> **你不需要先学完整编程。** 这篇教程教你把需求说清楚，让编程 Agent 创建和检查代码，再按清单完成本地运行、上传、部署与排错。

---

## 0. 开篇导航

### 0.1 最终会得到什么

完成必做部分后，你会得到一个“药店销售 AI 回复工作台”演示网站：

1. 客户和销售都能手动输入消息，模拟企业微信聊天。
2. 销售手动选中一条顾客消息后，AI 结合此前对话生成**恰好 3 条**不同语气的候选回复。
3. 候选回复可以作为文字发到页面里的模拟聊天区。
4. 候选回复可以交给 MiniMax TTS，生成可播放、可下载的真实 MP3。
5. 浏览器可以录制和回放销售的声音样本，但样本不上传、不训练。
6. 手机和电脑都能打开页面；电脑是双栏，手机是单列布局。

> ⚠️ **能力边界：** 这个 Demo 不连接真实企业微信，不保存聊天记录，不提供登录，不是真实音色克隆，也不能直接投入药店生产环境。页面中的“克隆展示”只表示“为未来克隆采集录音样本”，当前发出的语音仍是 MiniMax 系统音色。

| 模块 | 是否必做 | 用途 |
|---|---:|---|
| Trae 或其他编程 Agent | 是 | 生成、修改和检查项目代码 |
| Node.js、Git、浏览器 | 是 | 本地运行、版本管理、验收页面 |
| GitHub | 是 | 保存代码并连接 Vercel |
| Vercel | 是 | 托管网页和运行服务端 API |
| 文字模型 API | 是 | 生成 3 条候选回复 |
| MiniMax API | 是 | 把文字合成为 MP3 |
| NameSilo 域名 | 否 | 把默认网址换成自定义网址 |
| Cloudflare DNS | 否 | 管理域名解析，可完全跳过 |

### 0.2 两条复刻路线，只选一条

- **路线 A：从零生成。** 适合想学习“如何让 Agent 做项目”的读者。按第 2.1～2.4 节操作。
- **路线 B：克隆成品。** 适合想先跑起来的读者。直接跳到第 2.5 节，仓库地址为 `https://github.com/DoublHapp/softvoice.git`。
- 两条路线在“上传 GitHub”之前汇合。不要先生成一份项目，又把成品仓库克隆到同一个文件夹，否则文件会互相覆盖
![药店销售 AI 回复工作台最终效果](/images/essays/ai-reply-voice-demo-from-scratch/S01-final-desktop.png)

> 截图中的姓名、聊天与健康信息均为虚构演示数据。

---

# 一、前置准备

## 1.1 编程 Agent：会操作项目文件的 AI 助手

普通聊天 AI 通常只给你一段建议；**编程 Agent** 不仅能回答，还能读取当前项目、创建文件、运行测试、看到报错并修改代码。可以把它理解为“坐在电脑旁、但每次重要动作仍要你批准的程序员助手”。本教程以 Trae 为主线；Claude Code、Codex 或接入自有模型的工具也可以替代，但按钮位置会不同。

### 目标

安装 Trae，打开一个安全的空文件夹，进入 Agent 对话并完成最小测试。

### 操作步骤

1. 用 Chrome 或 Edge 打开 Trae 官方下载页，下载 Windows 安装包。
2. 双击安装包。普通用户保留默认选项即可。
3. 启动 Trae 并登录。若界面询问工作模式，选择能读取和编辑项目、运行命令的 **Agent** 模式，而不是只聊天的模式。
4. 点击 `File → Open Folder（文件 → 打开文件夹）`，选择一个专门用于测试的空文件夹。
5. 查看左侧文件树显示的文件夹名称，确认没有误开工作资料、密钥目录或其他敏感项目。
6. 在 Agent 输入框发送：`请在当前空文件夹创建 hello.txt，内容只有“Agent 已可用”，然后读取它确认内容，不要执行其他操作。`
7. 如果出现文件写入授权，只批准本测试文件；如果出现无关命令或访问其他目录，先拒绝并询问原因。

**成功标志：** 左侧出现 `hello.txt`，打开后只有“Agent 已可用”，Agent 能复述验证结果。

**失败怎么办：**

- 看不到 Agent 面板：在界面中查找 `Agent`、`Chat` 或侧栏 AI 图标。
- 无法创建文件：确认打开的是文件夹而非单个文件，并检查 Windows 文件夹是否只读。
- Agent 一直要求登录：完成账号验证，或换用其他编程 Agent。
- 修改范围超出当前文件夹：拒绝授权，重新强调“只允许当前项目目录”。

> ![Trae 下载页面](/images/essays/ai-reply-voice-demo-from-scratch/S02-trae-download.png)

> ![Trae 打开文件夹](/images/essays/ai-reply-voice-demo-from-scratch/S03-trae-open-folder.png)

> ![Trae Agent 模式](/images/essays/ai-reply-voice-demo-from-scratch/S04-trae-agent.png)

### 自接 API 时要懂的三件套

- **API Key：** 像一张会扣费的后台门卡。泄露后别人可能冒用你的额度。
- **Base URL：** 服务入口地址，像快递要送到哪个站点。
- **Model：** 具体调用哪个模型，像在菜单里点哪道菜。

笔者曾使用中转地址 `http://www.1314mc.net:1314/` 购买和调用模型，这是个人经历，**不是推荐、背书或安全担保**。它使用明文 HTTP，存在传输被窃听或篡改风险；中转服务还涉及稳定性、密钥托管、对话隐私、计费透明度和供应商合规问题。生产环境优先使用模型官方或可追责的可信 HTTPS 服务。不要因为本教程保留了这个地址就直接购买或上传真实顾客数据。

> ![模型 API 配置页](/images/essays/ai-reply-voice-demo-from-scratch/S05-agent-api-settings.png)

## 1.2 Windows 基础工具

### 1.2.1 安装 Node.js 20 或 22 LTS

Node.js 是运行这个网页项目开发工具的“发动机”。当前成品要求 `>=20 <23`，所以请选择 **20 LTS 或 22 LTS**，不要选 18，也不要抢先安装 23 以上版本。

1. 打开 Node.js 官方网站，进入下载页。
2. 选择标有 `LTS（长期支持版）` 的 20 或 22 版本 Windows 安装包。
3. 双击安装，保留“添加到 PATH”相关默认选项。
4. 安装结束后，关闭所有旧 PowerShell 和 Trae 终端，再重新打开，环境变量才会刷新。

> ![Node.js LTS 下载](/images/essays/ai-reply-voice-demo-from-scratch/S06-node-download.png)

### 1.2.2 安装 Git

Git 是项目的“存档和版本历史工具”。从 Git for Windows 官方网站下载安装。安装向导大部分保持默认；默认编辑器不熟悉也没关系，本教程不会要求在终端编辑器里写代码。确保安装器允许在命令行使用 Git。

> ![Git 安装](/images/essays/ai-reply-voice-demo-from-scratch/S07-git-install.png)

### 1.2.3 打开 PowerShell 并检查版本(mac相关命令可直接搜索或者问AI)

按键盘 `Win` 键，输入 `PowerShell`，打开 **Windows PowerShell**。命令要一条一条执行：复制一条，按 Enter，等待返回后再执行下一条。

```powershell
node --version
```

成功会看到类似 `v20.x.x` 或 `v22.x.x`。

```powershell
npm --version
```

成功会看到一串数字。npm 是随 Node.js 安装的“依赖下载工具”。

```powershell
git --version
```

成功会看到类似 `git version 2.x.x.windows.x`。

若提示“无法将……识别为 cmdlet、函数、脚本文件”：确认软件已安装，然后**关闭并重开 PowerShell**；仍失败时重启 Windows，再检查安装时是否加入 PATH。

> ![PowerShell 版本检查](/images/essays/ai-reply-voice-demo-from-scratch/S08-version-check.png)

### 1.2.4 Git 首次署名

在 PowerShell 中填写你希望显示在提交记录里的署名。它不是 GitHub 登录密码，也不要填 Token 或 API Key。

```powershell
git config --global user.name "你的提交署名"
```

```powershell
git config --global user.email "你的 GitHub 邮箱"
```

检查是否写入成功：

```powershell
git config --global --list
```

公开仓库不想暴露邮箱时，可在 GitHub 邮箱设置里使用平台提供的 `noreply` 邮箱，以 GitHub 当前页面为准。

## 1.3 GitHub：云端项目文件夹

### 目标

注册 GitHub，创建一个**空仓库**，稍后用于接收本地代码。

### 操作步骤

1. 打开 `https://github.com/`，点击 `Sign up（注册）`；已有账号就点 `Sign in（登录）`。
2. 完成邮箱验证。验证码、恢复码和密码不要发给 Agent。
3. 登录后点击右上角 `+`，选择 `New repository（新建仓库）`。
4. `Repository name` 可填 `my-ai-voice-demo`。
5. `Public` 表示所有人可看代码；`Private` 表示仅授权用户可看。无论哪种，**密钥都不能提交**。
6. 为避免首次推送冲突，本教程选择创建空仓库：不要勾选初始化 README、`.gitignore` 或 License。
7. 点击 `Create repository`，保留打开的仓库地址页面。

Vercel 后续必须获得此仓库的访问权限。私有仓库找不到时，通常是 GitHub Integration 没有授权该仓库。

### `.gitignore` 为什么重要

`.gitignore` 是“禁止 Git 打包的名单”。项目至少应忽略：

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
.trae/
.vercel/
*.log
```

`.env.example` 只能放变量名和假值，因此可保留；真实 `.env` 必须忽略。录音、生成的 MP3、顾客资料也不要放入仓库。

> ![GitHub 注册登录](/images/essays/ai-reply-voice-demo-from-scratch/S09-github-signin.png)

> ![创建 GitHub 仓库](/images/essays/ai-reply-voice-demo-from-scratch/S10-github-new-repo.png)

> ![GitHub 空仓库](/images/essays/ai-reply-voice-demo-from-scratch/S11-github-empty-repo.png)

## 1.4 Vercel：构建、托管和小型后端

Vercel 会从 GitHub 拉代码，执行构建，把 `dist` 网页放到公网，同时把 `api/*.ts` 作为 Serverless Functions 运行。Serverless 可理解为“有人请求时才工作的临时小后端”，因此不需要自己租 服务器。

1. 打开 `https://vercel.com/`。
2. 点击 `Sign Up` 或 `Log In`，选择 `Continue with GitHub`。
3. 在 GitHub 授权页确认授权范围。推荐只授权本教程所需仓库。
4. 暂时不用创建项目，第 2.7 节会逐项部署。

三种环境先记住：

| 环境 | 用途 | 常见触发方式 |
|---|---|---|
| Production | 正式演示地址 | 推送生产分支，通常是 `main` |
| Preview | 修改前预览 | 推送其他分支或提交 PR |
| Development | 本地开发配合 Vercel 工具 | `vercel dev` 等本地流程 |

免费计划的额度、限制和适用条件会变化，以 Vercel 当前定价页为准。这个 Demo 没有登录，公开链接会让任何访问者消耗你的文字与语音 API 额度。

> ![Vercel 登录](/images/essays/ai-reply-voice-demo-from-scratch/S12-vercel-login.png)

> ![Vercel 项目列表](/images/essays/ai-reply-voice-demo-from-scratch/S14-vercel-dashboard.png)

## 1.5 文字模型与语音模型 API

### 1.5.1 文字模型：以 DeepSeek 为例

项目需要的是 **OpenAI Chat Completions 兼容接口**。这不是要求必须买 OpenAI，而是要求供应商的请求和返回格式“说同一种语言”。DeepSeek 官方接口兼容这种格式。

DeepSeek 官方配置框架：

```text
OPENAI_API_KEY=你的_文字模型_API_Key
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

`deepseek-chat` 是本文用于复刻的示例名称。供应商可能调整模型、价格或可用范围，因此正式填写前仍要打开当前模型与价格页确认；如果控制台给出的名称不同，以控制台为准。**不要盲目照抄网上旧模型名。**官方文档入口：`https://api-docs.deepseek.com/`。

中转服务配置框架：

```text
OPENAI_API_KEY=你的_中转服务_API_Key
OPENAI_BASE_URL=https://可信中转服务域名/v1
OPENAI_MODEL=该中转服务实际支持的模型名
```

当前成品仓库 `.env.example` 的示例模型是 `glm-5.2-G`，这只表示仓库示例配置，**不代表项目正在使用 glm-5.2-G，也不代表所有供应商都提供该模型**。Base URL、Key 和 Model 必须来自同一个供应商并相互匹配。

### 1.5.2 MiniMax：把文字变成 MP3

当前成品使用同步 TTS 接口、`speech-2.8-turbo` 模型和系统音色 `female-chengshu`：

```text
MINIMAX_API_KEY=你的_MiniMax_API_Key
# 国际站
MINIMAX_BASE_URL=https://api.minimax.io
# 中国站账号请改用：https://api.minimax.com
MINIMAX_TTS_MODEL=speech-2.8-turbo
MINIMAX_VOICE_ID=female-chengshu
```

MiniMax 国际站与中国站的账号、域名和可用配置可能不同，不能把一个站点创建的 Key 随意配到另一个站点域名。以账号所属站点的当前官方文档为准。国际站 TTS 文档入口：`https://platform.minimax.io/docs/api-reference/speech-t2a-http`。

**TTS、录音和克隆不是同一件事：**

- 录音：浏览器采集一段声音，当前 Demo 只在本机内存回放。
- TTS：系统音色把输入文字读出来，当前 Demo 真正实现的是这一项。
- 音色克隆：上传获授权的声音样本，创建个人音色资产，再控制权限、费用、删除和审计；这需要登录、数据库、私有存储、租户隔离和明确授权，当前 Demo 没有实现。

### 获取 Key 的安全步骤

1. 只从服务商官方控制台注册和登录。
2. 进入 `API Keys` 或类似页面，点击 `Create`。
3. 给 Key 起项目用途名称，便于以后单独撤销。
4. 创建后把 Key 放进本机 `.env` 或 Vercel 环境变量，不要放进聊天、代码、截图、GitHub Issue。
5. 在账单页设置预算上限和告警；测试结束可撤销专用 Key。

> ![MiniMax API Key](/images/essays/ai-reply-voice-demo-from-scratch/S17-minimax-key.png)

## 1.6 可选：NameSilo + Cloudflare 自定义域名

这一节现在只做概念准备，实际操作见第 2.8 节。**完全跳过不影响 Demo**，Vercel 会免费提供类似 `项目名.vercel.app` 的默认网址。

- 域名：便于记忆的网址门牌。
- NameSilo：购买和续费门牌的注册商。
- DNS：把门牌指向网站所在地的导航簿。
- Cloudflare：可代管 DNS，也能提供代理和安全功能。
- Vercel：实际构建、托管网站，并验证域名归属。

笔者曾在 NameSilo购买了一个首年12块的域名。这只是个人购买经历，不是固定价格；币种、后缀、优惠、税费和续费价格都会变化，必须以最终结算页为准，尤其要比较**首年价与续费价**。

笔者购买和管理域名时使用的入口是 `https://www.namesilo.com/account/`。首次使用建议先从 NameSilo 官方主页进入并核对浏览器地址栏，不要通过陌生推广链接登录或付款。

---

# 二、具体搭建过程

## 2.1 路线 A：创建文件夹与先写计划

### 目标

创建一个没有旧文件和敏感资料的项目目录，让 Agent 先复述计划，再开始编码。

### 操作步骤

1. 打开 Windows 文件资源管理器。
2. 进入 `C:\code`；若没有该目录，可以新建。
3. 新建文件夹 `my-ai-voice-demo`，最终路径示例为 `C:\code\my-ai-voice-demo`。
4. 在 Trae 点击 `File → Open Folder`，打开这个文件夹本身。
5. 确认左侧文件树为空，且没有 `.env`、工作文档、照片或其他项目。
6. 先发送：`请先阅读我下一条需求，只输出实施计划、文件结构、风险和验收清单，不要写代码，不要安装依赖。`
7. 再粘贴第 2.2 节完整主提示词。
8. 审阅 Agent 的计划，确认它理解“不接企微、不持久化、不做真实克隆、密钥仅服务端”等边界后再批准。

**成功标志：** Agent 先给计划而不是直接堆代码；计划包含前端、`api` 后端、测试、安全和验收。

**常见错误：** 打开 `C:\code` 上级目录会让 Agent 看到其他项目；发现后立即停止，重新打开具体项目文件夹。

## 2.2 可直接复制的完整主提示词

把下面整段复制给新的编程 Agent。它不依赖本教程上下文。

```text
你是一名资深全栈工程师和测试工程师。请在当前空文件夹从零实现一个可运行、可部署到 Vercel 的“药店销售 AI 回复工作台 Demo”。先不要写代码：先检查工作区，输出实施计划、建议文件结构、风险、测试计划和浏览器验收清单；等我明确批准后再实施。除非我明确要求，否则不要 git commit、不要 push、不要访问当前项目目录之外的文件。

一、业务背景
连锁药店销售通过企业微信联系老年顾客，希望 AI 根据模拟对话提供回复建议，并能把最终文字转成语音。这个项目只做演示，不接入真实企业微信。

二、明确边界
1. 不接真实企业微信接口，所有发送只进入页面内的模拟聊天区。
2. 不做账号登录，不接数据库，不持久化聊天、录音或音频，刷新后可以清空。
3. 不实现真实音色训练或克隆。浏览器录音仅作为“未来音色克隆前的样本采集展示”，样本只保留在当前浏览器内存并可回放，不上传。
4. 真正发送的语音使用 MiniMax 系统音色 TTS 生成 MP3。
5. Demo 不能被描述为医疗诊断、处方或正式生产系统。

三、技术栈与部署
1. 使用 React 18、Vite、TypeScript，采用当前稳定且互相兼容的依赖。
2. Node.js 支持范围设为 >=20 <23。
3. 后端使用 Vercel api/*.ts Serverless Functions，不要求单独服务器。
4. 浏览器只调用同源 /api/candidates 和 /api/tts。
5. 候选接口调用 OpenAI Chat Completions 兼容服务；TTS 接口调用 MiniMax。
6. 所有供应商 API Key 只从服务端环境变量读取，绝不能进入前端 bundle、VITE_* 变量、浏览器日志或响应。
7. 提供 vercel.json、.env.example 和 README。示例值必须是假占位符，不得包含任何真实或看似真实的密钥。

四、界面与交互
1. 桌面端为双栏工作台：左侧模拟对话，右侧候选回复与音色样本区域；移动端为清晰单列，并允许在客户/销售输入间切换且分别保留草稿。
2. 页面预置一段虚构且无真实个人信息的药店关怀对话。
3. 客户输入和销售输入必须分开。支持 Enter 发送、Shift+Enter 换行，并正确处理中文输入法组合态，不能在选字时误发送。
4. 顾客消息可单选。生成候选时，只发送截至被选中顾客消息的完整文本上下文。
5. 点击生成后必须得到恰好 3 条内容不同的候选，语气依次为“简洁关怀”“耐心解释”“自然跟进”。
6. 每条候选可编辑，编辑后可作为文字加入模拟聊天。
7. 每条候选可请求 MiniMax 生成真实 MP3；生成后可播放和下载。切换或销毁音频时释放旧 Object URL，避免内存泄漏。
8. 浏览器录音支持开始、停止、回放和删除。清楚标注“不上传、不训练、尚未克隆”。不支持 MediaRecorder 或没有权限时，友好提示且不影响文字和 TTS 主流程。
9. 页面适配现代 Chrome、Edge、Safari、Firefox；麦克风只在 localhost 或 HTTPS 下使用。

五、药店安全约束
系统提示词只允许复购提醒、日常关怀、客观产品信息和引导咨询医生或专业药师；不得诊断，不得建议停药、换药、改变剂量，不得承诺疗效，不得虚构库存、价格、订单、病史或药师结论，不得利用老年人信息差施压销售。遇到药物不适、剂量、停换药或病情变化，必须建议联系医生或专业药师；遇到紧急症状建议及时就医。界面提醒销售发送前人工审核。

六、服务端接口要求
1. /api/candidates 仅接受预期 HTTP 方法和 application/json，校验消息数组、sender、文本长度、数量及总体大小。
2. 使用环境变量 OPENAI_API_KEY、OPENAI_BASE_URL、OPENAI_MODEL。Base URL 规范化后调用 /chat/completions。
3. 要求模型返回包含 candidates 数组的结构化结果；服务端必须验证恰好 3 条、非空、去重、每条长度上限。可以有限兼容完整 Markdown JSON 代码块、说明文字包裹的平衡 JSON、固定三种语气标签或连续 1/2/3 编号文本，但不能从任意散文猜测。
4. /api/tts 校验文本，读取 MINIMAX_API_KEY、MINIMAX_BASE_URL、MINIMAX_TTS_MODEL、MINIMAX_VOICE_ID，调用 MiniMax 同步 TTS，返回 audio/mpeg。
5. 默认 TTS 模型 speech-2.8-turbo，默认系统音色 female-chengshu；站点 Base URL 由环境变量决定。
6. 两个接口设置 no-store 与 nosniff，不把上游详细响应、Key、Authorization、顾客完整对话写入日志。
7. 提供稳定错误码：INVALID_REQUEST、SERVER_NOT_CONFIGURED、RATE_LIMITED、UPSTREAM_ERROR、MODEL_RESPONSE_INVALID；前端显示用户可理解的中文提示。
8. 正确处理请求取消、网络异常、上游非 2xx、无效 JSON 和错误音频。

七、工程与安全
1. .gitignore 至少忽略 node_modules/、dist/、日志、.env、.env.*，但保留 .env.example；还要忽略 .trae/、.vercel/ 和本地工具文件。
2. 不加入硬编码密钥，不使用 VITE_OPENAI_API_KEY 或 VITE_MINIMAX_API_KEY。
3. 避免 dangerouslySetInnerHTML；用户和模型文本按普通文本渲染。
4. UI 要有 loading、disabled、防重复点击和明确错误状态。
5. 不宣称提示词能替代医疗审核；在 README 说明公开链接会消耗额度，需要限流和预算告警。

八、测试与验收
1. 测试先行：优先为输入校验、候选解析、API 错误映射、对象 URL 创建/释放、录音状态、中文输入法和关键交互写测试，再实现功能。
2. 提供 npm test -- --run、npm run typecheck、npm run lint、npm run build 脚本并实际执行。
3. 修复所有测试、类型、lint、build 错误，不通过就不能声称完成。
4. 最后启动应用做浏览器验收：桌面与移动布局、客户/销售输入、选择顾客消息、恰好 3 条候选、编辑、文字发送、MP3 播放下载、麦克风允许/拒绝。
5. 如果本地只有 vite dev，要明确它只能验证前端；完整 Serverless API 用 vercel dev 或 Vercel Preview。
6. 完成后汇报创建/修改的文件、验证命令与结果、尚未验证的外部 API 项。不要编造 API 成功结果。
```

### 三条后续短提示词

计划太快进入编码时：

```text
先暂停实现。请按“需求理解、文件结构、实施顺序、测试、风险、验收”重新给计划，不要创建或修改文件。
```

批准计划后：

```text
计划已批准。请按测试先行实施，每完成一个阶段就运行对应验证；不要提交或推送，所有密钥只能使用明显占位符。
```

出现报错时：

```text
请先收集证据再修改：读取相关代码和完整错误，提出最可能的 2～3 个原因，选择最小修复，随后运行测试、类型检查、lint 和 build。不要打印 .env、API Key、Authorization 或顾客完整对话。
```

## 2.3 通用行业改造提示词

先复制模板，替换方括号内容：

```text
请把当前“AI 回复 + 语音”Demo 改造成以下行业版本，但保留服务端密钥、输入校验、固定候选数量、人工审核、TTS、测试和部署安全机制。

行业：[例如养老服务]
客户画像：[例如子女为父母咨询日间照护]
销售目标：[例如解释服务流程并预约线下参观]
允许事项：[例如客观介绍时间、公开服务项目]
禁止事项：[例如承诺治疗效果、虚构床位、制造焦虑]
三种候选语气：[语气一]、[语气二]、[语气三]
品牌色与风格：[例如暖橙色、可信、适合长辈阅读]
语音用途：[例如把审核后的服务说明转为系统音色语音]
高风险升级规则：[例如出现急症、财务、法律或个资问题时转人工]

先输出改造计划和新增合规风险，不要立刻修改。不得把业务提示词当作正式法律、医疗或安全审核。
```

示例：养老服务可以强调“不得承诺治疗或虚构床位”；教育咨询可以强调“不保证录取、不制造升学焦虑”。医疗、金融、保险、法律、未成年人等高风险领域必须由业务、法务和专业人员审核，修改提示词不能替代正式合规流程。

## 2.4 本地运行与检查

### 2.4.1 先看文件是否齐全

Agent 完成后，左侧文件树至少应看到：

```text
package.json
src/
api/
.gitignore
.env.example
vercel.json
README.md
```

缺少任何一项，先让 Agent 解释。`.env.example` 应只有变量名和假值，不能出现实际 Key。

> ![项目文件树](/images/essays/ai-reply-voice-demo-from-scratch/S18-project-tree.png)

### 2.4.2 在正确目录打开 PowerShell

在文件资源管理器进入项目文件夹，点击地址栏，输入 `powershell` 后回车；或在 Trae 打开集成终端。提示符末尾应是 `C:\code\my-ai-voice-demo>`。

如果项目已有 `package-lock.json`，使用可重复安装：

```powershell
npm ci
```

如果没有锁文件，首次使用：

```powershell
npm install
```

等待命令自己结束。成功通常回到提示符，且没有 `npm ERR!`。警告不一定等于失败，但应让 Agent 判断是否需要处理。

复制环境变量模板：

```powershell
Copy-Item .env.example .env
```

然后只在本机编辑 `.env`，把占位符替换成你自己的 Key。不要把 `.env` 内容粘给 Agent。先确认 Git 会忽略它：

```powershell
git check-ignore .env
```

成功应输出 `.env`。没有输出就先修复 `.gitignore`，不要继续上传。

### 2.4.3 启动与完整联调的区别

只查看前端：

```powershell
npm run dev
```

终端会给出类似 `http://localhost:5173/` 的地址。按住 Ctrl 点击地址，或复制到浏览器。这个命令持续运行很正常；结束时回到终端按 `Ctrl+C`。

Vite 开发服务器只负责前端。调用 `/api/candidates` 和 `/api/tts` 的完整本地联调，可使用：

```powershell
npx vercel dev
```

首次可能要求登录、关联项目或安装 Vercel CLI。按页面提示操作，但不要把 Key 输入聊天。若不想处理本地 Vercel CLI，可以先部署到 Vercel Preview 再联调。

### 2.4.4 四组自动检查

先停止开发服务器，或新开一个项目终端。逐条执行：

```powershell
npm test -- --run
```

成功标志：测试全部通过，没有 failed。

```powershell
npm run typecheck
```

成功标志：命令正常结束，没有 TypeScript 错误。

```powershell
npm run lint
```

成功标志：没有 ESLint error。

```powershell
npm run build
```

成功标志：出现构建完成信息并生成 `dist`。任何一条失败，都把**错误文本而不是密钥**交给 Agent，修复后四条重跑。

### 2.4.5 浏览器手工验收

- [ ] 客户输入可以加入左侧模拟会话。
- [ ] 销售输入可以发送文字。
- [ ] Enter 发送、Shift+Enter 换行，中文输入法选字不会误发送。
- [ ] 能单选一条顾客消息。
- [ ] 点击生成后恰好出现 3 条不同候选。
- [ ] 语音能生成 MP3、播放和下载。
- [ ] 麦克风允许后可录制、停止、回放和删除。
- [ ] 拒绝麦克风权限时有友好提示，文字与 TTS 仍可用。
- [ ] 缩窄浏览器后变为适合手机的单列布局。

## 2.5 路线 B：直接克隆成品仓库

### 目标

不让 Agent 从零生成，直接复制当前成品作为学习起点。

### 操作步骤

在 `C:\code` 文件夹打开 PowerShell，执行：

```powershell
git clone https://github.com/DoublHapp/softvoice.git
```

成功后进入项目：

```powershell
Set-Location .\softvoice
```

安装锁定版本依赖：

```powershell
npm ci
```

复制模板：

```powershell
Copy-Item .env.example .env
```

只在本机 `.env` 填自己的配置，然后运行：

```powershell
npm test -- --run
```

```powershell
npm run typecheck
```

```powershell
npm run lint
```

```powershell
npm run build
```

```powershell
npm run dev
```

只是学习可以在 GitHub 使用 `Fork` 保存自己的副本。若要发展成自己的产品，应更换仓库、品牌、业务文案、模型供应商、安全配置和合规流程，而不是把演示项目原样当生产系统。仓库会更新，始终优先阅读最新 `README.md` 和 `.env.example`。

## 2.6 将代码上传 GitHub

> ⚠️ **上传前红线：** `.env`、Key、录音、MP3、顾客资料一旦进入 GitHub，即使后来删除也应视为已经泄露。立刻撤销并换新，不能只删文件。

### 2.6.1 初始化和安全检查

路线 A 在项目根目录执行：

```powershell
git init
```

路线 B 如果想推送到自己的新仓库，先确认你理解 fork/远程仓库关系；不要误推到无权限的原仓库。

检查状态：

```powershell
git status --short
```

在输出中逐项确认：

- [ ] 没有 `.env` 或任何 `.env.local`。
- [ ] 没有录音、MP3、顾客数据导出。
- [ ] 没有 `.trae`、`.vercel`、`node_modules`、`dist`。
- [ ] `.env.example` 的值全是占位符。

确认后暂存：

```powershell
git add .
```

再次检查即将提交的文件：

```powershell
git status
```

### 2.6.2 首次提交和推送

```powershell
git commit -m "创建 AI 回复语音 Demo"
```

```powershell
git branch -M main
```

把下面地址替换成你在第 1.3 节创建的仓库 HTTPS 地址：

```powershell
git remote add origin https://github.com/你的用户名/my-ai-voice-demo.git
```

检查地址，避免推错仓库：

```powershell
git remote -v
```

确认无误后：

```powershell
git push -u origin main
```

GitHub 现在通常通过浏览器或凭据管理器认证，不要把账号密码、Personal Access Token 粘到教程、代码或 Agent 对话。

> ![GitHub 项目文件](/images/essays/ai-reply-voice-demo-from-scratch/S25-github-files.png)

### 常见 Git 错误

| 现象 | 原因 | 处理 |
|---|---|---|
| `remote origin already exists` | 已有远程地址 | 先 `git remote -v`；确认要更换才执行 `git remote set-url origin 新地址` |
| `rejected`、远程含 README | 远程不是空仓库 | 小白最稳妥是新建真正空仓库；不要随便强推覆盖 |
| `Authentication failed` | 登录授权失效 | 重新走浏览器/凭据管理器认证，不把 Token 发给 Agent |
| `Could not resolve host` | DNS 或网络问题 | 检查浏览器能否打开 GitHub，稍后重试或联系网络管理员 |
| `src refspec main does not match` | 尚无提交或分支名不同 | 确认 commit 成功，再执行 `git branch -M main` |

后续每次更新固定三步：

```powershell
git add .
```

```powershell
git commit -m "描述本次更新"
```

```powershell
git push
```

连接 Vercel 后，`main` 的推送会自动触发 Production；其他分支或 PR 通常触发 Preview，不需要额外配置 GitHub Actions。

## 2.7 Vercel 一键部署

### 2.7.1 导入仓库

1. 进入 Vercel Dashboard。
2. 点击 `Add New → Project（新建项目）`。
3. 在 GitHub 仓库列表找到项目，点击 `Import（导入）`。
4. 找不到仓库时，点击调整 GitHub App 权限，授权这个仓库后刷新。

> ![Vercel 导入仓库](/images/essays/ai-reply-voice-demo-from-scratch/S26-vercel-import.png)

### 2.7.2 构建参数

逐项确认：

| 项目 | 应填内容 |
|---|---|
| Framework Preset | `Vite` |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 20 或 22 |

如果代码实际放在仓库子目录，Root Directory 才需要改；本教程项目在根目录，不要填本机 `C:\code\...` 路径。

### 2.7.3 添加环境变量

在 `Environment Variables（环境变量）` 区逐个新增。不要把多行当成一个变量；Name 填左边，Value 填自己的真实值。

| Name | 教程示例 Value | 说明 |
|---|---|---|
| `OPENAI_API_KEY` | `你的_文字模型_API_Key` | 服务端文字模型密钥 |
| `OPENAI_BASE_URL` | `https://api.deepseek.com/v1` | DeepSeek 官方兼容入口示例 |
| `OPENAI_MODEL` | `deepseek-chat` | DeepSeek 示例；部署前到当前模型页确认 |
| `MINIMAX_API_KEY` | `你的_MiniMax_API_Key` | MiniMax 服务端密钥 |
| `MINIMAX_BASE_URL` | `https://api.minimax.io` | 国际站示例，须与 Key 所属站点一致 |
| `MINIMAX_TTS_MODEL` | `speech-2.8-turbo` | 当前成品使用的 TTS 模型 |
| `MINIMAX_VOICE_ID` | `female-chengshu` | 当前成品系统音色示例 |

若使用其他兼容供应商，则 Base URL、Key、模型名全部按该供应商文档填写。

为 Production、Preview、Development 选择相应作用范围。Preview 也会调用上游、消耗额度，不应随意公开。不要创建 `VITE_OPENAI_API_KEY`、`VITE_MINIMAX_API_KEY`，`VITE_` 会把值暴露给浏览器。

> ![Vercel 环境变量](/images/essays/ai-reply-voice-demo-from-scratch/S28-vercel-env-names.png)

### 2.7.4 部署与状态

1. 点击 `Deploy（部署）`。
2. `Building` 表示正在安装和构建，先等待。
3. `Ready` 表示部署完成，可打开分配的网址。
4. `Failed` 表示失败，展开 Build Logs，从第一处真正错误开始排查。

> ⚠️ 修改环境变量后，旧部署不会自动拥有新值。进入 `Deployments`，对最新正确代码点击 `Redeploy（重新部署）`，完成后再测试。

> ![Vercel Ready](/images/essays/ai-reply-voice-demo-from-scratch/S29-vercel-ready.png)

### 2.7.5 线上验收和日志

打开 HTTPS 成品地址，重做第 2.4.5 节清单。按 `F12` 打开开发者工具，进入 `Network（网络）`：

1. 点击生成候选，查找 `/api/candidates`。
2. 点击语音，查找 `/api/tts`。
3. `2xx` 表示请求成功；`4xx` 多为请求、权限、额度或限流；`5xx` 多为服务端配置或上游异常。
4. 不要截图或复制 Request Headers 中的认证信息；正常设计下浏览器请求根本不应含供应商 Key。

服务端排查：Vercel 项目进入 `Logs` 或具体部署的 `Runtime Logs`，按请求时间、函数路径、状态码和安全错误码定位。不要为了排错新增打印 Key、Authorization、完整上游响应或顾客对话的日志。

| 错误/现象 | 含义 | 优先处理 |
|---|---|---|
| `SERVER_NOT_CONFIGURED` | 服务端变量不完整 | 检查变量拼写、作用范围，然后 Redeploy |
| `RATE_LIMITED` | 请求过快或供应商限流 | 等待、检查额度、设置合理限流 |
| `UPSTREAM_ERROR` | 认证、模型、网关或语音上游异常 | 核对同一供应商的 Key/Base URL/Model 和 Runtime Logs |
| `MODEL_RESPONSE_INVALID` | 模型返回格式不符合三候选规则 | 重试，确认模型遵循 JSON/标签/编号格式 |
| 麦克风失败 | 权限、安全上下文或兼容问题 | 使用 HTTPS/localhost，检查系统及站点权限 |
| MP3 失败 | MiniMax 配置、余额、模型或音色权限异常 | 核对站点和四项 MiniMax 变量 |

## 2.8 可选：NameSilo、Cloudflare 与 Vercel 自定义域名

> 本节可完全跳过。平台页面和 DNS 要求会变化，**Vercel Domains 页面当时给出的记录值优先级最高**，不要永久照抄网上某个 IP。

### 2.8.1 NameSilo 购买域名

1. 登录 NameSilo，搜索想要的域名。
2. 比较后缀、首年价格、续费价格、税费与汇率。
3. 加入购物车，关闭不需要的邮箱、建站、证书等附加服务。
4. 检查自动续费设置和最终结算金额，再付款。
5. 付款后进入域名管理，找到 `Nameservers` 或 DNS/NS 管理入口。

### 2.8.2 Cloudflare 接管 DNS

1. 登录 Cloudflare Dashboard。
2. 点击 `Add a site`、`Onboard a domain` 或当前界面中功能相同的“添加域名”。
3. 输入根域名，例如 `example.com`，不要带 `https://` 或路径。
4. 选择 `Free` 计划。
5. 审核 Cloudflare 扫描到的旧 DNS，特别是已有网站和邮箱的 A、CNAME、MX、TXT 记录；漏掉邮件记录可能导致邮箱中断。
6. Cloudflare 会分配两个 Nameserver，逐字复制。
7. 若 NameSilo 已开启旧 DNSSEC，按 Cloudflare 当前迁移指引先处理，否则换 NS 后可能无法解析。
8. 回到 NameSilo，删除原 Nameserver，只填 Cloudflare 给出的两个值并保存。
9. 回 Cloudflare 等待状态变为 `Active`。传播可能几分钟，也可能更久。

Windows 可检查 NS：

```powershell
nslookup -type=ns 你的域名 1.1.1.1
```

输出应逐渐变为 Cloudflare 分配的两个 NS。

### 2.8.3 在 Vercel 添加域名并填写 DNS

1. 打开 Vercel 项目。
2. 进入 `Settings → Domains`。
3. 添加根域名 `example.com`。
4. 再添加 `www.example.com`，按需要选择一个主域名并把另一个重定向过去。
5. Vercel 会展示此刻要求的 A、CNAME 或验证记录。保持页面打开。
6. 到 Cloudflare `DNS → Records → Add record`，逐项填写 Vercel 给出的 Type、Name、Value。
7. 初次调通把 Proxy status 设为 `DNS only（灰云）`，TTL 可用 Auto。
8. 回 Vercel 等待 `Valid Configuration`，再检查 HTTPS 证书正常。
9. 确认 Vercel 验证、页面、HTTPS、`/api/candidates`、`/api/tts` 全部正常后，才根据实际需求评估是否开启 Cloudflare 代理。

> ⚠️ 若启用代理，确保 `/api/*` 不被缓存。缓存 AI 或 TTS POST 请求可能返回错乱数据。SSL/TLS 通常推荐 `Full (strict)`，但必须以源站证书状态和 Vercel、Cloudflare当前指引为准，不能为消除报错盲目选择不安全模式。

### 域名排错树

1. **域名完全不生效/NXDOMAIN：** 查 NameSilo 的 NS 是否与 Cloudflare 两个值完全一致 → 查 Cloudflare 是否 Active → 等待 DNS 传播 → 查 DNSSEC 是否阻断。
2. **Vercel 一直 Invalid：** 查 Cloudflare 记录 Type/Name/Value → 删除同名冲突记录 → 先设灰云 DNS only → 以 Vercel 当前提示为准。
3. **证书 Pending：** 先确认 DNS 已指向 Vercel → 关闭代理完成验证 → 等待签发 → 不要反复删除添加域名。
4. **循环重定向：** 检查 Vercel 根域名/www 重定向是否与 Cloudflare Redirect Rules 重复；只保留一个明确方向。
5. **522：** Cloudflare 无法连接源站；先灰云确认 Vercel 本身可访问，再检查代理配置。
6. **525：** Cloudflare 与源站 TLS 握手失败；确认 Vercel 证书有效，再按官方指引设置 Full (strict)。
7. **页面正常但 API 异常：** 检查 `/api/*` 是否被 Cache Rules 缓存或安全规则误拦；POST API 应绕过缓存。

自定义域名和 Cloudflare 可能改变访问路径，但**不保证中国大陆所有地区、运营商和时段稳定**，也不替代备案、跨境数据、内容和业务资质等合规要求。

---

# 三、简略技术说明（可跳过）

## 3.1 整体架构

```text
浏览器页面
  ├─ POST /api/candidates → Vercel Function → OpenAI 兼容文字模型
  │                         ← 3 条结构化候选回复
  ├─ POST /api/tts        → Vercel Function → MiniMax TTS
  │                         ← audio/mpeg MP3
  └─ 浏览器麦克风 → 本机内存中的录音样本，不上传
```

浏览器永远只访问同源 `/api/...`。Vercel Function 在服务端从环境变量取 Key，再代替浏览器访问供应商。

## 3.2 为什么 Key 不能写前端

Vite 构建后的前端文件会下载到每个访问者的电脑。任何人都可查看 JavaScript、Network 请求和浏览器存储。把 Key 写进 React、HTML 或 `VITE_*`，相当于把保险箱钥匙贴在门外。服务端环境变量不是“绝对安全”，但至少不会正常出现在前端包和浏览器请求中。

## 3.3 术语翻译

- **React：** 把页面拆成可组合的小部件。
- **Vite：** 本地启动和打包网页的工具。
- **TypeScript：** 在运行前帮助发现类型错误的 JavaScript。
- **Serverless Function：** 请求到来时由平台运行的一小段后端代码。
- **环境变量：** 部署平台后台保存的配置纸条，代码只读取名字。
- **Git 自动部署：** 推送代码后，Vercel 自动拉取、构建和上线。
- **DNS：** 把域名翻译到服务地址的导航系统。
- **HTTPS：** 浏览器与网站之间的加密传输，也是线上麦克风权限的前提之一。

## 3.4 为什么固定三条、要求结构化

固定三条便于界面稳定展示，也让销售在“简洁关怀、耐心解释、自然跟进”之间选择。结构化 JSON 让后端明确知道哪段是语气、哪段是正文。当前成品也有限兼容完整 JSON 代码块、说明文字包裹的平衡 JSON、三种固定标签或连续 `1/2/3` 编号文本，但仍会检查：恰好三条、非空、单条不超过 500 字、内容不重复。它不会从任意散文中猜三条回复。

## 3.5 Demo 不能直接生产使用

它不接真实企微、不持久化、无登录、无数据库、无租户隔离、无应用级身份限流。真实系统还需要授权、访问控制、审计、数据生命周期、供应商协议、内容审核、告警、灾备和企业合规评估。

---

# 四、安全、费用与合规

## 4.1 密钥处理

1. Key 只放本机 `.env` 和 Vercel Environment Variables。
2. `.env` 必须在 `.gitignore` 中；`.env.example` 只放明显假值。
3. 禁止创建任何含真实 Key 的 `VITE_*` 变量。
4. Key 若出现在聊天、截图、GitHub、Issue、日志或前端，立即在供应商控制台撤销并换新。
5. 从 Git 删除文件、改成 Private 或覆盖提交，均不能证明泄露的 Key 恢复安全。

## 4.2 公开链接与费用

当前 Demo 无登录，知道链接的人都可能调用两个付费 API。至少配置：

- Vercel Firewall 或等效能力的速率限制，规则和免费额度以当前页面为准。
- 文字模型和 MiniMax 的预算上限、余额告警、独立测试 Key。
- Preview 与 Production 分开额度，避免预览链接耗尽正式预算。
- 不需要公开时使用部署保护，或及时撤销演示专用 Key。

## 4.3 隐私与第三方处理

候选生成会把对话文本发送给文字模型供应商；TTS 会把待朗读文本发送给 MiniMax。不要输入真实姓名、手机号、身份证、病历、处方、订单或其他非必要个人信息。正式业务必须评估供应商隐私政策、数据保存、跨境处理、训练用途、删除机制和企业协议。

## 4.4 药店安全边界

提示词只能降低风险，不能保证模型永不出错。AI 不应诊断、指导停换药或剂量、承诺疗效、虚构库存价格或替代药师/医生。销售必须发送前人工确认；正式业务还需药师/医生边界、企业法务、信息安全和监管要求评估。

## 4.5 中转服务声明

`http://www.1314mc.net:1314/` 仅是笔者个人经历，不构成推荐、背书或担保。明文 HTTP、服务中断、密钥托管、账单争议、隐私和供应链合规均是实质风险。生产环境优先官方或可信 HTTPS 服务，且不要向未经审核的中转服务发送顾客内容。

---

# 五、故障排查清单

| 现象 | 最可能原因 | 检查位置 | 修复动作 |
|---|---|---|---|
| `node`/`npm` 命令不存在 | 未安装或 PATH 未刷新 | PowerShell、Node 安装 | 安装 20/22 LTS，关闭重开终端或重启 |
| `git` 命令不存在 | Git 未安装或 PATH 问题 | Git for Windows | 重装并允许命令行使用，重开终端 |
| `npm ci` 失败 | 无锁文件、网络/依赖问题 | `package-lock.json`、错误首行 | 无锁文件用 `npm install`；有锁文件不要随意删除，交给 Agent 分析 |
| 页面空白 | 前端运行错误或路径错误 | 浏览器 Console、终端 | 从第一条错误修复，确认在项目根目录运行 |
| Vercel 构建失败 | Node、类型、lint 或构建配置问题 | Build Logs | 本地跑四项检查，核对 Vite、`dist`、Node 20/22 |
| AI 回复不可用 | 文字模型变量缺失/不匹配 | Network、Runtime Logs、Env | 核对 Key/Base URL/Model 同属一个供应商，Redeploy |
| `MODEL_RESPONSE_INVALID` | 模型未返回可解析三条 | Runtime Logs 中安全错误码 | 重试或增强结构化提示，不记录完整顾客内容 |
| `RATE_LIMITED` | 请求频率或额度限制 | 状态码 429、供应商账单 | 等待、充值/调整额度、增加限流和禁用重复点击 |
| 语音失败 | MiniMax 站点、Key、模型、音色不匹配 | `/api/tts`、Runtime Logs | 核对四项变量、余额和权限，Redeploy |
| MP3 无法播放 | 返回不是音频或浏览器状态异常 | Network Content-Type | 应为 `audio/mpeg`；刷新重试并查 TTS 上游 |
| 麦克风被拒绝 | 用户拒绝、系统权限、非安全地址 | 浏览器站点权限、Windows 隐私 | 使用 HTTPS/localhost，允许浏览器和站点访问 |
| 环境变量修改未生效 | 旧部署仍在运行 | Vercel Deployments | 修改正确作用范围后 Redeploy |
| Git push 失败 | 认证、网络、远程或分支问题 | `git remote -v`、错误输出 | 按第 2.6 节对应错误处理，不强推未知远程 |
| 域名不生效 | NS/DNS 未传播或记录冲突 | NameSilo、Cloudflare、Vercel | 核对两个 NS 和 Vercel 当时记录，等待传播 |
| 证书 Pending/525 | DNS 未验证或 TLS 配置冲突 | Vercel Domains、Cloudflare SSL | 先灰云验证源站证书，再按指引用 Full (strict) |

向 Agent 求助时复制：

```text
请按“现象 → 证据 → 假设 → 最小修复 → 验证”排查。先读取相关文件和我提供的错误，不要猜。禁止读取或打印 .env、API Key、Authorization、Cookie、完整上游响应和顾客对话。修改前说明原因，修改后运行 npm test -- --run、npm run typecheck、npm run lint、npm run build，并分别报告真实结果；外部 API 未实测就明确写未实测。
```

---

# 六、附录

## 6.1 一页式发布前检查清单

### 功能

- [ ] 客户/销售双输入、中文输入法和移动布局正常。
- [ ] 可选择顾客消息，生成恰好 3 条不同候选。
- [ ] MiniMax MP3 可生成、播放、下载。
- [ ] 录音明确标注“不上传、不训练、尚未克隆”。

### 工程

- [ ] `npm test -- --run` 全通过。
- [ ] `npm run typecheck` 全通过。
- [ ] `npm run lint` 全通过。
- [ ] `npm run build` 全通过。
- [ ] Vercel 为 Vite、根目录 `./`、输出 `dist`、Node 20/22。

### 安全与合规

- [ ] Git 状态中没有 `.env`、Key、录音、MP3、顾客资料。
- [ ] 没有任何真实 Key 写进源码、README、截图或 `VITE_*`。
- [ ] Production/Preview 配置正确，变量修改后已 Redeploy。
- [ ] 配置限流、预算上限和告警，公开范围可控。
- [ ] 演示数据虚构，销售人工审核，未宣称诊断或真实音色克隆。

### 上线

- [ ] `/api/candidates` 与 `/api/tts` 在线实测成功。
- [ ] Runtime Logs 不记录密钥或完整顾客内容。
- [ ] HTTPS 下麦克风允许/拒绝两条路径均正常。
- [ ] 若使用域名，根域名、www、证书、重定向和 `/api/*` 均正常。

## 6.2 环境变量空白模板

下面全部是占位符。复制后只在本机 `.env` 或 Vercel 后台替换，绝不提交真实值。

```text
OPENAI_API_KEY=你的_文字模型_API_Key
OPENAI_BASE_URL=https://你的可信文字模型服务域名/v1
OPENAI_MODEL=供应商当前支持的实际模型名
MINIMAX_API_KEY=你的_MiniMax_API_Key
MINIMAX_BASE_URL=https://与你的账号站点匹配的_MiniMax_域名
MINIMAX_TTS_MODEL=speech-2.8-turbo
MINIMAX_VOICE_ID=female-chengshu
```

## 6.3 常用 PowerShell / Git 命令速查

| 目的 | 命令 |
|---|---|
| 查看 Node | `node --version` |
| 查看 npm | `npm --version` |
| 查看 Git | `git --version` |
| 进入目录 | `Set-Location C:\code\my-ai-voice-demo` |
| 复制环境模板 | `Copy-Item .env.example .env` |
| 安装锁定依赖 | `npm ci` |
| 首次安装依赖 | `npm install` |
| 启动前端 | `npm run dev` |
| 完整本地 Vercel | `npx vercel dev` |
| 运行测试 | `npm test -- --run` |
| 类型检查 | `npm run typecheck` |
| Lint | `npm run lint` |
| 构建 | `npm run build` |
| 查看 Git 状态 | `git status --short` |
| 查看远程 | `git remote -v` |
| 后续提交 | `git add .` → `git commit -m "说明"` → `git push` |

## 6.4 主提示词纯净版说明

为了避免同一份超长提示词在文档中重复两次造成维护不一致，第 2.2 节代码块就是可一键复制的**纯净完整主提示词**：从“你是一名资深全栈工程师”开始，复制到该代码块末尾即可。它已经包含业务、边界、UI、API、安全、测试和不自动提交要求，不依赖当前仓库或当前对话。

## 6.5 官方资料入口

- Vercel 项目设置：`https://vercel.com/docs/projects/project-configuration/project-settings`
- Vercel GitHub 自动部署：`https://vercel.com/docs/git/vercel-for-github`
- Cloudflare 完整 DNS 接入：`https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/`
- DeepSeek API：`https://api-docs.deepseek.com/`
- MiniMax TTS：`https://platform.minimax.io/docs/api-reference/speech-t2a-http`
- 成品仓库：`https://github.com/DoublHapp/softvoice`
