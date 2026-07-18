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

export interface Post {
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  content: LocalizedText
}
