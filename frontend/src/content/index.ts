import type { Post, Profile, Project } from '@/types/content'
export { tools } from './tools'
export { dbverseEntries } from './dbverse'
import contentSystemEn from './posts/designing-content-systems.en.md?raw'
import contentSystemZh from './posts/designing-content-systems.zh-CN.md?raw'
import vueRendererEn from './posts/vue-rendering-notes.en.md?raw'
import vueRendererZh from './posts/vue-rendering-notes.zh-CN.md?raw'

export const profile: Profile = {
  name: 'DB',
  role: { 'zh-CN': '业余脑洞维护员 / 偶尔写点能跑的东西', en: 'Part-time idea wrangler / occasional maker of things that run' },
  intro: {
    'zh-CN': '这里有一些替身般的小工具，还有 DB 没想明白就先写下来的随笔。放心，认真并不是访问本站的前置条件。',
    en: 'There are Stand-like little tools here, plus essays DB wrote before figuring anything out. Serious thinking is strictly optional.',
  },
  location: { 'zh-CN': '地球某处 · 偶尔在线', en: 'Somewhere on Earth · occasionally online' },
  availability: { 'zh-CN': '欢迎投喂怪点子', en: 'Strange ideas welcome' },
  skills: ['Vue', 'TypeScript', 'Java', 'Spring Boot', 'Node.js', 'System Design'],
}

export const projects: Project[] = [
  {
    slug: 'signal-console',
    title: 'Signal Console',
    sequence: 'PRJ-001',
    summary: {
      'zh-CN': '面向分布式服务的实时可观测控制台，将关键指标转化为可操作信号。',
      en: 'A real-time observability console that turns distributed service metrics into actionable signals.',
    },
    description: {
      'zh-CN': '以事件流为核心的技术概念项目，探索高密度监控界面、渐进式信息披露和异常状态表达。界面在桌面端保持操作密度，在移动端保留关键诊断路径。',
      en: 'A concept project built around event streams, exploring dense monitoring interfaces, progressive disclosure, and anomaly communication across desktop and mobile.',
    },
    status: 'building',
    stack: ['Vue 3', 'TypeScript', 'WebSocket', 'ECharts'],
    repository: 'https://github.com/DoublHapp',
    featured: true,
  },
  {
    slug: 'content-pipeline',
    title: 'Content Pipeline',
    sequence: 'PRJ-002',
    summary: {
      'zh-CN': '类型安全的双语内容管线，让 Markdown、路由和 SEO 元数据共享同一数据源。',
      en: 'A type-safe bilingual content pipeline connecting Markdown, routes, and SEO metadata.',
    },
    description: {
      'zh-CN': '以构建时校验为边界，将内容维护保持在 Git 工作流中。稳定 slug、结构化元数据与本地化字段共同形成可扩展的内容基础。',
      en: 'A build-time validated content layer that stays inside the Git workflow, combining stable slugs, structured metadata, and localized fields.',
    },
    status: 'online',
    stack: ['Vite', 'Markdown', 'Vue Router', 'SEO'],
    demo: 'https://goddb.top',
    featured: true,
  },
  {
    slug: 'migration-lab',
    title: 'Migration Lab',
    sequence: 'PRJ-003',
    summary: {
      'zh-CN': '聚焦 Vue 2 到 Vue 3 迁移差异的实验场与可验证迁移策略集合。',
      en: 'A lab for verifiable Vue 2 to Vue 3 migration strategies and runtime behavior.',
    },
    description: {
      'zh-CN': '围绕 VNode、响应式与组件兼容边界建立小型实验，用测试固定框架行为，再逐步收敛迁移风险。',
      en: 'Small experiments around VNodes, reactivity, and component compatibility that use tests to pin framework behavior and reduce migration risk.',
    },
    status: 'building',
    stack: ['Vue 2', 'Vue 3', 'Vitest', 'AST'],
    repository: 'https://github.com/DoublHapp',
    featured: false,
  },
]

export const posts: Post[] = [
  {
    slug: 'designing-content-systems',
    title: { 'zh-CN': '为长期维护设计内容系统', en: 'Designing content systems for the long run' },
    excerpt: {
      'zh-CN': '从稳定标识、构建时内容到双语上下文，建立可预测的个人网站内容工作流。',
      en: 'Stable identities, build-time content, and bilingual context for a predictable publishing workflow.',
    },
    kind: 'technical',
    category: 'Architecture',
    tags: ['Content', 'i18n', 'DX'],
    publishedAt: '2026-07-12',
    readingTime: 5,
    content: { 'zh-CN': contentSystemZh, en: contentSystemEn },
  },
  {
    slug: 'vue-rendering-notes',
    title: { 'zh-CN': '阅读 Vue 渲染器的三个切入点', en: "Three entry points into Vue's renderer" },
    excerpt: {
      'zh-CN': '用 VNode、patch 与标志位三条线索建立 Vue 运行时源码的阅读地图。',
      en: 'A practical map of Vue runtime internals through VNodes, patching, and compiler flags.',
    },
    kind: 'technical',
    category: 'Vue Internals',
    tags: ['Vue', 'VNode', 'Runtime'],
    publishedAt: '2026-06-28',
    readingTime: 6,
    content: { 'zh-CN': vueRendererZh, en: vueRendererEn },
  },
]
