import type { DbverseEntry } from '@/types/content'
import sekiroZh from './dbverse/sekiro-immortality-story.zh-CN.md?raw'
import narutoZh from './dbverse/naruto-blue-bird-memory.zh-CN.md?raw'

export const dbverseEntries: DbverseEntry[] = [
  {
    slug: 'sekiro-immortality-story',
    title: { 'zh-CN': '只狼Sekiro：这是一个关于不死的故事', en: 'Sekiro: A Story About Immortality' },
    excerpt: { 'zh-CN': '记录一下自己的只狼历程。', en: 'A video record of DB’s journey through Sekiro.' },
    section: 'screening', moods: ['obsessed', 'melancholy'], tags: ['只狼', 'Sekiro', '游戏剪辑'], status: 'published', accent: '#e6532f', publishedAt: '2023-01-03', content: { 'zh-CN': sekiroZh }, featured: true,
    media: { platform: 'bilibili', videoId: 'BV1xg411x7s8', sourceUrl: 'https://www.bilibili.com/video/BV1xg411x7s8/', creator: { 'zh-CN': 'DB（B站：六玄渊）', en: 'DB (Bilibili: 六玄渊)' }, title: { 'zh-CN': '只狼Sekiro：这是一个关于不死的故事', en: 'Sekiro: A Story About Immortality' } },
  },
  {
    slug: 'naruto-blue-bird-memory',
    title: { 'zh-CN': '不知不觉，火影也完结6年了，可当那首《青鸟》、那些忍术再现，还是不禁热血沸腾', en: 'Six Years Later, Blue Bird Still Ignites the Naruto Spirit' },
    excerpt: { 'zh-CN': '当《青鸟》和那些忍术再次出现，热血会自己找到回来的路。', en: 'When Blue Bird and those jutsu return, the old excitement finds its way back.' },
    section: 'screening', moods: ['obsessed', 'broken'], tags: ['火影忍者', '青鸟', '动漫剪辑'], status: 'published', accent: '#2f8eff', publishedAt: '2023-06-01', content: { 'zh-CN': narutoZh }, featured: true,
    media: { platform: 'bilibili', videoId: 'BV1Pk4y1s7Mb', sourceUrl: 'https://www.bilibili.com/video/BV1Pk4y1s7Mb/', creator: { 'zh-CN': 'DB（B站：六玄渊）', en: 'DB (Bilibili: 六玄渊)' }, title: { 'zh-CN': '不知不觉，火影也完结6年了，可当那首《青鸟》、那些忍术再现，还是不禁热血沸腾', en: 'Six Years Later, Blue Bird Still Ignites the Naruto Spirit' } },
  },
]
