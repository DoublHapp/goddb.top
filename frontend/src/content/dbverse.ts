import type { DbverseEntry, DbverseIp, DbverseIpSlug } from '@/types/content'
import sekiroZh from './dbverse/sekiro-immortality-story.zh-CN.md?raw'
import narutoZh from './dbverse/naruto-blue-bird-memory.zh-CN.md?raw'

export const dbverseIps: DbverseIp[] = [
  {
    slug: 'naruto',
    name: { 'zh-CN': '火影忍者', en: 'Naruto' },
    title: { 'zh-CN': '查克拉蓝星域', en: 'Chakra Blue System' },
    description: { 'zh-CN': '蓝色查克拉行星、发光环带与卫星信标，热血记忆仍在轨道上回响。', en: 'A blue chakra world with luminous rings and orbital beacons carrying memories that still burn bright.' },
    accent: '#35a7ff', secondaryColor: '#65fff0', celestialType: 'planet', position: [-4.6, 0.7, 0], radius: 1.55, orbitSpeed: 0.12, mass: 'medium',
  },
  {
    slug: 'sekiro',
    name: { 'zh-CN': '只狼', en: 'Sekiro' },
    title: { 'zh-CN': '不死赤蚀星域', en: 'Immortal Eclipse System' },
    description: { 'zh-CN': '赤红月蚀、残破小行星带与漂浮余烬，记录一段关于不死的旅程。', en: 'A crimson eclipse, shattered asteroid belt, and drifting embers charting a journey through immortality.' },
    accent: '#ef5335', secondaryColor: '#ffb044', celestialType: 'eclipse', position: [4.5, -0.45, -1], radius: 1.7, orbitSpeed: 0.08, mass: 'heavy',
  },
]

export const dbverseEntries: DbverseEntry[] = [
  {
    slug: 'sekiro-immortality-story',
    title: { 'zh-CN': '只狼Sekiro：这是一个关于不死的故事', en: 'Sekiro: A Story About Immortality' },
    excerpt: { 'zh-CN': '记录一下自己的只狼历程。', en: 'A video record of DB’s journey through Sekiro.' },
    ip: 'sekiro', moods: ['obsessed', 'melancholy'], tags: ['只狼', 'Sekiro', '游戏剪辑'], status: 'published', accent: '#e6532f', publishedAt: '2023-01-03', content: { 'zh-CN': sekiroZh }, featured: true,
    media: { platform: 'bilibili', videoId: 'BV1xg411x7s8', sourceUrl: 'https://www.bilibili.com/video/BV1xg411x7s8/', creator: { 'zh-CN': 'DB（B站：六玄渊）', en: 'DB (Bilibili: 六玄渊)' }, title: { 'zh-CN': '只狼Sekiro：这是一个关于不死的故事', en: 'Sekiro: A Story About Immortality' } },
  },
  {
    slug: 'naruto-blue-bird-memory',
    title: { 'zh-CN': '不知不觉，火影也完结6年了，可当那首《青鸟》、那些忍术再现，还是不禁热血沸腾', en: 'Six Years Later, Blue Bird Still Ignites the Naruto Spirit' },
    excerpt: { 'zh-CN': '当《青鸟》和那些忍术再次出现，热血会自己找到回来的路。', en: 'When Blue Bird and those jutsu return, the old excitement finds its way back.' },
    ip: 'naruto', moods: ['obsessed', 'broken'], tags: ['火影忍者', '青鸟', '动漫剪辑'], status: 'published', accent: '#2f8eff', publishedAt: '2023-06-01', content: { 'zh-CN': narutoZh }, featured: true,
    media: { platform: 'bilibili', videoId: 'BV1Pk4y1s7Mb', sourceUrl: 'https://www.bilibili.com/video/BV1Pk4y1s7Mb/', creator: { 'zh-CN': 'DB（B站：六玄渊）', en: 'DB (Bilibili: 六玄渊)' }, title: { 'zh-CN': '不知不觉，火影也完结6年了，可当那首《青鸟》、那些忍术再现，还是不禁热血沸腾', en: 'Six Years Later, Blue Bird Still Ignites the Naruto Spirit' } },
  },
]

export const getDbverseIp = (slug: string | string[] | undefined) => dbverseIps.find((ip) => ip.slug === slug)
export const getDbverseEntriesByIp = (slug: DbverseIpSlug) => dbverseEntries.filter((entry) => entry.ip === slug)
