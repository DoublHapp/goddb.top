import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './HomePage.vue'

vi.mock('@/composables/useSeo', () => ({ useSeo: vi.fn() }))
const playIntro = vi.fn()
vi.mock('@/composables/usePhantomIntro', () => ({ usePhantomIntro: () => ({ isPlaying: false, playIntro }) }))

const mountHome = () => mount(HomePage, {
  shallow: true,
  global: {
    stubs: {
      RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
      MissionPanel: { template: '<div v-if="open" data-testid="mission-panel" :data-channel="channel" />', props: ['channel', 'open'] },
    },
  },
})

describe('HomePage Phantom 首页', () => {
  it('频道卡使用任务面板，DBverse 使用隔离的真实路由', async () => {
    const wrapper = mountHome()

    expect(wrapper.findAll('[data-channel-trigger]').map((item) => item.attributes('data-channel-trigger'))).toEqual(['essays', 'projects', 'about'])
    expect(wrapper.find('a[href="/dbverse"]').exists()).toBe(true)
    expect(wrapper.find('[data-channel-trigger="dbverse"]').exists()).toBe(false)

    await wrapper.get('[data-channel-trigger="essays"]').trigger('click')
    expect(wrapper.get('[data-testid="mission-panel"]').attributes('data-channel')).toBe('essays')
    expect(wrapper.get('[data-channel-trigger="essays"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-channel-trigger="essays"]').attributes('aria-controls')).toBe('mission-panel')
  })

  it('控制面板可以手动重播凝视', async () => {
    const wrapper = mountHome()

    await wrapper.get('.phantom-hero-console button').trigger('click')
    expect(playIntro).toHaveBeenCalledWith({ manual: true })
  })

  it('最新内容入口全部指向现有随笔详情路由', () => {
    const wrapper = mountHome()
    const storyLinks = wrapper.findAll('.phantom-story')

    expect(storyLinks.length).toBeGreaterThan(0)
    expect(storyLinks.every((item) => item.attributes('href')?.startsWith('/essays/'))).toBe(true)
  })
})
