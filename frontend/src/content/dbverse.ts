import type { DbverseEntry } from '@/types/content'
import p5rPalaceZh from './dbverse/p5r-palace-after-hours.zh-CN.md?raw'
import redChamberZh from './dbverse/dream-of-the-red-chamber-notes.zh-CN.md?raw'
import jojoZh from './dbverse/jojo-bizarre-frequency.zh-CN.md?raw'
import editingRoomZh from './dbverse/p5r-editing-room.zh-CN.md?raw'
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
    slug: 'p5r-editing-room',
    title: { 'zh-CN': 'P5R 剪辑室：时间轴在反抗', en: 'P5R editing room: the timeline fights back' },
    excerpt: { 'zh-CN': '游戏剪辑预留放映位。当前播放器正在等待 DB 投喂。', en: 'A future home for game edits. The player is waiting for DB.' },
    section: 'screening', moods: ['obsessed', 'chaotic'], tags: ['游戏剪辑', 'P5R', 'Video'], status: 'awaiting-content', accent: '#ff8a38', content: { 'zh-CN': editingRoomZh }, featured: false,
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
