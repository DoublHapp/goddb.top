const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character)

export function renderMarkdown(source: string) {
  return source.trim().split(/\n\s*\n/).map((block) => {
    const trimmed = block.trim()
    const code = trimmed.match(/^```([\w-]*)\n([\s\S]*?)```$/)
    if (code) return `<pre data-language="${escapeHtml(code[1] || 'text')}"><code>${escapeHtml(code[2])}</code></pre>`
    const safe = escapeHtml(trimmed)
    if (safe.startsWith('# ')) return `<h1>${safe.slice(2)}</h1>`
    if (safe.startsWith('## ')) return `<h2>${safe.slice(3)}</h2>`
    if (safe.startsWith('### ')) return `<h3>${safe.slice(4)}</h3>`
    return `<p>${safe.replace(/\n/g, '<br>')}</p>`
  }).join('')
}
