const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character)

export function renderMarkdown(source: string) {
  return source.trim().split(/\n\s*\n/).map((block) => {
    const safe = escapeHtml(block.trim())
    if (safe.startsWith('# ')) return `<h1>${safe.slice(2)}</h1>`
    if (safe.startsWith('## ')) return `<h2>${safe.slice(3)}</h2>`
    if (safe.startsWith('### ')) return `<h3>${safe.slice(4)}</h3>`
    return `<p>${safe.replace(/\n/g, '<br>')}</p>`
  }).join('')
}
