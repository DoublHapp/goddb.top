const copyWithExecCommand = (text: string) => {
  if (!document.body || typeof document.execCommand !== 'function') return false
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
  const selection = window.getSelection()
  const ranges: Range[] = []
  if (selection) for (let index = 0; index < selection.rangeCount; index += 1) ranges.push(selection.getRangeAt(index).cloneRange())
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.readOnly = true
  textarea.setAttribute('aria-hidden', 'true')
  textarea.style.position = 'fixed'
  textarea.style.inset = '0 auto auto -9999px'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  try {
    textarea.focus({ preventScroll: true })
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
    selection?.removeAllRanges()
    ranges.forEach((range) => selection?.addRange(range))
    activeElement?.focus({ preventScroll: true })
  }
}

export const copyText = async (text: string) => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return copyWithExecCommand(text)
  }
}
