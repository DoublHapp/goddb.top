import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyText } from './clipboard'

const setClipboard = (writeText?: (text: string) => Promise<void>) => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: writeText ? { writeText } : undefined })
const setExecCommand = (implementation?: (command: string) => boolean) => Object.defineProperty(document, 'execCommand', { configurable: true, value: implementation })

afterEach(() => {
  setClipboard()
  setExecCommand()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('安全复制文本', () => {
  it('优先使用 Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const execCommand = vi.fn(() => true)
    setClipboard(writeText)
    setExecCommand(execCommand)
    await expect(copyText('https://goddb.top/dbverse')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('https://goddb.top/dbverse')
    expect(execCommand).not.toHaveBeenCalled()
  })

  it('Clipboard API 失败时使用 execCommand 并清理临时节点', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    setClipboard(vi.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError')))
    setExecCommand((command) => command === 'copy')
    await expect(copyText('fallback-value')).resolves.toBe(true)
    expect(document.querySelector('textarea')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('两种复制方式均失败时返回失败并清理临时节点', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('blocked')))
    setExecCommand(() => { throw new Error('blocked') })
    await expect(copyText('blocked-value')).resolves.toBe(false)
    expect(document.querySelector('textarea')).toBeNull()
  })
})
