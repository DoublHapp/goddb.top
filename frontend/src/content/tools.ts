import type { Tool } from '@/types/content'

export const tools: Tool[] = [
  {
    slug: 'spark',
    name: { 'zh-CN': 'Spark', en: 'Spark' },
    summary: { 'zh-CN': '把一个念头点亮成可玩的创意方向。', en: 'Turn one thought into a playable creative direction.' },
    description: { 'zh-CN': '一个面向创作者的灵感启动器，为模糊想法生成清晰的探索入口。', en: 'A creative ignition tool that gives vague ideas a clear starting point.' },
    category: 'creative', icon: 'Sparkles', accent: '#8b7cf6', featured: true, route: '/tools/spark', tags: ['Ideas', 'Creative'], status: 'coming-soon', subdomain: 'spark.goddb.top',
    features: [{ 'zh-CN': '灵感提示卡', en: 'Prompt cards' }, { 'zh-CN': '方向聚类', en: 'Direction clustering' }],
    teaser: { 'zh-CN': '即将上线：给它一个关键词，开始一场小型创意实验。', en: 'Coming soon: give it one keyword and start a small creative experiment.' },
  },
  {
    slug: 'palette',
    name: { 'zh-CN': 'Palette', en: 'Palette' },
    summary: { 'zh-CN': '从情绪与材质中探索一组有性格的配色。', en: 'Explore expressive palettes from mood and material.' },
    description: { 'zh-CN': '为界面、海报和数字实验寻找一组有明确情绪的颜色关系。', en: 'Find color relationships with a clear mood for interfaces, posters, and experiments.' },
    category: 'creative', icon: 'Palette', accent: '#ff8b7b', featured: true, route: '/tools/palette', tags: ['Color', 'Visual'], status: 'coming-soon', subdomain: 'palette.goddb.top',
    features: [{ 'zh-CN': '情绪到颜色', en: 'Mood to color' }, { 'zh-CN': '对比度检查', en: 'Contrast checks' }],
    teaser: { 'zh-CN': '即将上线：输入一种感觉，得到值得继续推敲的颜色起点。', en: 'Coming soon: name a feeling and get a color starting point worth refining.' },
  },
  {
    slug: 'poster',
    name: { 'zh-CN': 'Poster', en: 'Poster' },
    summary: { 'zh-CN': '把文字、节奏与留白编排成一张数字海报。', en: 'Compose words, rhythm, and space into a digital poster.' },
    description: { 'zh-CN': '一个克制的海报构图实验，用少量规则探索文字与视觉层次。', en: 'A restrained poster composition experiment built from a small set of visual rules.' },
    category: 'creative', icon: 'PanelTop', accent: '#63d5c7', featured: true, route: '/tools/poster', tags: ['Layout', 'Type'], status: 'coming-soon', subdomain: 'poster.goddb.top',
    features: [{ 'zh-CN': '文字构图', en: 'Type composition' }, { 'zh-CN': '导出海报', en: 'Poster export' }],
    teaser: { 'zh-CN': '制作中：将一句话变成一张有秩序、也有意外的海报。', en: 'In progress: turn one sentence into a poster with order and surprise.' },
  },
  {
    slug: 'motion',
    name: { 'zh-CN': 'Motion', en: 'Motion' },
    summary: { 'zh-CN': '用简单参数试出让界面有呼吸感的动效。', en: 'Tune simple parameters for interfaces that feel alive.' },
    description: { 'zh-CN': '一个动效预览实验，用时间、缓动和距离建立可复用的运动语言。', en: 'A motion preview lab for building reusable movement language from time, easing, and distance.' },
    category: 'utility', icon: 'Waypoints', accent: '#f1b66c', featured: false, route: '/tools/motion', tags: ['Motion', 'UI'], status: 'coming-soon', subdomain: 'motion.goddb.top',
    features: [{ 'zh-CN': '缓动预览', en: 'Easing preview' }, { 'zh-CN': '参数复制', en: 'Copy parameters' }],
    teaser: { 'zh-CN': '即将上线：拖动几个参数，找到恰到好处的运动感。', en: 'Coming soon: tune a few parameters until the movement feels just right.' },
  },
]
