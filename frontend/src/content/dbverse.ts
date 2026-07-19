import type { DbverseEntry } from '@/types/content'
import p5rPalaceZh from './dbverse/p5r-palace-after-hours.zh-CN.md?raw'
import redChamberZh from './dbverse/dream-of-the-red-chamber-notes.zh-CN.md?raw'
import jojoZh from './dbverse/jojo-bizarre-frequency.zh-CN.md?raw'
import sekiroZh from './dbverse/sekiro-immortality-story.zh-CN.md?raw'
import narutoZh from './dbverse/naruto-blue-bird-memory.zh-CN.md?raw'
import resourcePileZh from './dbverse/db-resource-pile.zh-CN.md?raw'
import dailyRantZh from './dbverse/daily-rant-transmission.zh-CN.md?raw'

export const dbverseEntries: DbverseEntry[] = [
  {
    slug: 'p5r-palace-after-hours',
    title: { 'zh-CN': 'P5R：下班后继续潜入殿堂', en: 'P5R: Another palace after hours' },
    excerpt: { 'zh-CN': '怪盗团、爵士乐，以及“再玩十分钟”引发的时间失踪案。', en: 'Phantom thieves, jazz, and the mystery of ten minutes becoming three hours.' },
    section: 'games', moods: ['obsessed', 'broken'], tags: ['P5R', 'Persona 5 Royal', 'Atlus'], status: 'awaiting-content', accent: '#ff335f', content: { 'zh-CN': p5rPalaceZh }, featured: true,
  },
  {
    slug: 'dream-of-the-red-chamber-notes',
    title: { 'zh-CN': '红楼梦：全员都让我操心', en: 'Dream of the Red Chamber: worrying about everyone' },
    excerpt: { 'zh-CN': '一边知道结局，一边继续围观大观园大型破防现场。', en: 'Knowing the ending and entering the Grand View Garden anyway.' },
    section: 'books', moods: ['melancholy', 'obsessed'], tags: ['红楼梦', '曹雪芹', '阅读'], status: 'awaiting-content', accent: '#d94f8e', content: { 'zh-CN': redChamberZh }, featured: true,
  },
  {
    slug: 'jojo-bizarre-frequency',
    title: { 'zh-CN': 'JOJO：检测到奇妙频率', en: 'JOJO: bizarre frequency detected' },
    excerpt: { 'zh-CN': '替身、名场面和一些不摆姿势就说不出口的话。', en: 'Stands, iconic scenes, and thoughts that require a pose.' },
    section: 'anime', moods: ['hilarious', 'chaotic'], tags: ['JOJO', '荒木飞吕彦', '替身'], status: 'awaiting-content', accent: '#8d5cff', content: { 'zh-CN': jojoZh }, featured: true,
  },
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
  {
    slug: 'db-resource-pile',
    title: { 'zh-CN': '资源堆：先看授权再开捡', en: 'Resource pile: check the license first' },
    excerpt: { 'zh-CN': '原创、官方、开源或明确授权，否则再酷也不能端上来。', en: 'Original, official, open, or clearly licensed. Cool is not a license.' },
    section: 'resources', moods: ['chaotic'], tags: ['资源', '开源', '授权'], status: 'awaiting-content', accent: '#20bfa9', content: { 'zh-CN': resourcePileZh }, featured: false,
  },
  {
    slug: 'daily-rant-transmission',
    title: { 'zh-CN': '吐槽信号：尚未调频', en: 'Rant transmission: frequency pending' },
    excerpt: { 'zh-CN': '留给凌晨两点突然觉得非说不可的话。', en: 'Reserved for things that become urgent at 2 a.m.' },
    section: 'rants', moods: ['hilarious', 'chaotic'], tags: ['吐槽', '日常', '胡言乱语'], status: 'awaiting-content', accent: '#38a7ff', content: { 'zh-CN': dailyRantZh }, featured: false,
  },
]
