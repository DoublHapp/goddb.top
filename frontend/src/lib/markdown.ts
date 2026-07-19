import DOMPurify from 'dompurify'
import { marked, Renderer, type Tokens } from 'marked'

export interface MarkdownHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface MarkdownDocument {
  html: string
  headings: MarkdownHeading[]
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character)
const stripTags = (value: string) => value.replace(/<[^>]*>/g, '').trim()
const decodeHtml = (value: string) => {
  const element = document.createElement('textarea')
  element.innerHTML = value
  return element.value
}
const slugify = (value: string) => value.toLocaleLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section'
const isRelativeUrl = (value: string) => /^(?:#|\/[^/]|\.\.?\/)/.test(value)

export function renderMarkdownDocument(source: string): MarkdownDocument {
  const headings: MarkdownHeading[] = []
  const slugCounts = new Map<string, number>()
  const renderer = new Renderer()
  const originalCode = renderer.code.bind(renderer)
  renderer.html = ({ text }) => escapeHtml(text)
  renderer.code = (token: Tokens.Code) => {
    const html = originalCode(token)
    const language = escapeHtml(token.lang?.split(/\s+/)[0] || 'text')
    return html.replace('<pre>', `<pre data-language="${language}">`)
  }
  renderer.heading = ({ tokens, depth }) => {
    const content = renderer.parser.parseInline(tokens)
    if (depth !== 2 && depth !== 3) return `<h${depth}>${content}</h${depth}>`
    const text = decodeHtml(stripTags(renderer.parser.parseInline(tokens, renderer.parser.textRenderer)))
    const base = slugify(text)
    const count = (slugCounts.get(base) ?? 0) + 1
    slugCounts.set(base, count)
    const id = count === 1 ? base : `${base}-${count}`
    headings.push({ id, text, level: depth })
    return `<h${depth} id="${id}">${content}</h${depth}>`
  }
  const parsed = marked.parse(source, { async: false, breaks: true, gfm: true, renderer }) as string
  const html = DOMPurify.sanitize(parsed, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img'],
    ALLOWED_ATTR: ['id', 'href', 'title', 'src', 'alt', 'data-language'],
    ALLOW_DATA_ATTR: false,
  })
  const container = document.createElement('div')
  container.innerHTML = html
  container.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const href = link.getAttribute('href') ?? ''
    if (/^(?:mailto:|tel:)/i.test(href) || isRelativeUrl(href)) return
    try {
      const url = new URL(href, window.location.href)
      if (!/^https?:$/.test(url.protocol)) {
        link.removeAttribute('href')
        return
      }
      if (url.origin !== window.location.origin) {
        link.target = '_blank'
        link.rel = 'noreferrer noopener'
      }
    } catch {
      link.removeAttribute('href')
    }
  })
  container.querySelectorAll<HTMLImageElement>('img[src]').forEach((image) => {
    const src = image.getAttribute('src') ?? ''
    if (isRelativeUrl(src)) return
    try {
      const url = new URL(src, window.location.href)
      if (!/^https?:$/.test(url.protocol)) image.removeAttribute('src')
    } catch {
      image.removeAttribute('src')
    }
  })
  return { html: container.innerHTML, headings }
}

export const renderMarkdown = (source: string) => renderMarkdownDocument(source).html
