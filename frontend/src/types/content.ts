export type Locale = 'zh-CN' | 'en'

export type LocalizedText = Record<Locale, string>

export interface Profile {
  name: string
  role: LocalizedText
  intro: LocalizedText
  location: LocalizedText
  availability: LocalizedText
  skills: string[]
}

export interface Project {
  slug: string
  title: string
  sequence: string
  summary: LocalizedText
  description: LocalizedText
  status: 'online' | 'building' | 'archived'
  stack: string[]
  repository?: string
  demo?: string
  featured: boolean
}

export type ToolKind = 'creative' | 'utility'
export type ToolStatus = 'coming-soon' | 'online' | 'paused'

export interface Tool {
  slug: string
  name: LocalizedText
  summary: LocalizedText
  description: LocalizedText
  category: ToolKind
  icon: string
  accent: string
  featured: boolean
  route: string
  tags: string[]
  status: ToolStatus
  subdomain: string
  features: LocalizedText[]
  teaser: LocalizedText
}

export type PostKind = 'daily' | 'inspiration' | 'technical'

export interface Post {
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  kind: PostKind
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  content: LocalizedText
}

export type DbverseSection = 'games' | 'books' | 'anime' | 'screening' | 'resources' | 'rants'
export type DbverseMood = 'obsessed' | 'broken' | 'hilarious' | 'melancholy' | 'chaotic'
export type DbverseStatus = 'awaiting-content' | 'published'

export interface DbverseMedia {
  platform: 'bilibili' | 'youtube'
  videoId: string
  title?: LocalizedText
}

export interface DbverseResource {
  label: LocalizedText
  url: string
  source: string
  license: string
}

export interface DbverseEntry {
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  section: DbverseSection
  moods: DbverseMood[]
  tags: string[]
  status: DbverseStatus
  accent: string
  publishedAt?: string
  content: { 'zh-CN': string; en?: string }
  media?: DbverseMedia
  resources?: DbverseResource[]
  featured: boolean
}
