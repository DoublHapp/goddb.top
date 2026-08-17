import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MissionPanel from './MissionPanel.vue'

const mountPanel = (channel = 'essays') => mount(MissionPanel, {
  attachTo: document.body,
  props: { channel, open: true },
  global: { stubs: { RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] } } },
})

describe('MissionPanel 频道任务面板', () => {
  it('打开随笔频道时呈现真实文章入口', () => {
    const wrapper = mountPanel()

    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBe('true')
    expect(wrapper.get('h2').text()).toContain('随笔')
    expect(wrapper.text()).toContain('网站搬迁记：从 Vercel 到自建服务器')
    expect(wrapper.find('a[href="/essays/website-migration-to-self-hosted"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('项目频道明确标记仍在建设中的内容', () => {
    const wrapper = mountPanel('projects')

    expect(wrapper.text()).toContain('工具正在搓')
    expect(wrapper.find('[data-status="building"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('打开后聚焦关闭按钮并通过 Escape 请求关闭', async () => {
    const wrapper = mountPanel('dbverse')
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-action="close"]').element)
    expect(wrapper.get('[role="dialog"]').attributes('aria-describedby')).toBe('mission-panel-dbverse-description')
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('Tab 在任务面板首尾焦点之间循环', async () => {
    const wrapper = mountPanel()
    await wrapper.vm.$nextTick()
    const dialog = wrapper.get('[role="dialog"]')
    const close = wrapper.get('[data-action="close"]')
    const links = wrapper.findAll('.mission-panel__item')

    await close.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(links.at(-1)?.element)
    ;(links.at(-1)?.element as HTMLElement).focus()
    await dialog.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(close.element)
    wrapper.unmount()
  })

  it('关闭状态不向可访问性树暴露任务面板', () => {
    const wrapper = mount(MissionPanel, { props: { channel: 'essays', open: false } })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
