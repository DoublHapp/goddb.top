import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SiteHeader from './SiteHeader.vue'

const playIntro = vi.fn()
const toggleSound = vi.fn()

vi.mock('vue-router', () => ({ useRoute: () => ({ path: '/' }) }))
vi.mock('@/composables/useLocale', () => ({ useLocale: () => ({ locale: 'zh-CN', t: { common: { brandHome: '返回 DB 首页', primaryNav: '主导航', mobileNav: '移动端导航', menu: '打开菜单', lightTheme: '开灯看看', darkTheme: '关灯看看' }, home: { eyeMark: { replay: '重播 DB 品牌开场' } }, nav: { home: '首页', blog: '随笔', dbverse: 'DB宇宙', projects: '作品', about: '关于' }, language: 'EN' }, toggleLocale: vi.fn() }) }))
vi.mock('@/composables/useTheme', () => ({ useTheme: () => ({ isDark: false, toggleTheme: vi.fn() }) }))
vi.mock('@/composables/usePhantomIntro', () => ({ usePhantomIntro: () => ({ isPlaying: false, playIntro }) }))
vi.mock('@/composables/useSound', () => ({ useSound: () => ({ enabled: false, label: '静音', ariaPressed: 'false', toggleSound }) }))

const mountHeader = () => mount(SiteHeader, {
  attachTo: document.body,
  global: { stubs: { RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] } } },
})

beforeEach(() => {
  playIntro.mockClear()
  toggleSound.mockClear()
})

describe('SiteHeader Phantom 页头', () => {
  it('品牌眼标可以重播开场', async () => {
    const wrapper = mountHeader()
    const brand = wrapper.get('[data-action="replay-brand"]')

    expect(brand.attributes('aria-label')).toBe('重播 DB 品牌开场')
    expect(brand.find('[data-testid="phantom-eye-mark"]').exists()).toBe(true)
    await brand.trigger('click')
    expect(playIntro).toHaveBeenCalledWith({ manual: true })
    wrapper.unmount()
  })

  it('桌面导航暴露当前首页和有序频道', () => {
    const wrapper = mountHeader()
    const nav = wrapper.get('nav[aria-label="主导航"]')

    expect(nav.get('a[href="/"]').attributes('aria-current')).toBe('page')
    expect(nav.findAll('a').map((item) => item.text())).toEqual(expect.arrayContaining([
      expect.stringMatching(/00.*首页/),
      expect.stringMatching(/01.*随笔/),
      expect.stringMatching(/02.*DB宇宙/),
      expect.stringMatching(/03.*作品/),
      expect.stringMatching(/04.*关于/),
    ]))
    wrapper.unmount()
  })

  it('声音控件呈现持久化状态并调用切换动作', async () => {
    const wrapper = mountHeader()
    const sound = wrapper.get('[data-action="sound"]')

    expect(sound.text()).toContain('静音')
    expect(sound.attributes('aria-pressed')).toBe('false')
    await sound.trigger('click')
    expect(toggleSound).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('移动菜单打开后聚焦首个入口并可由 Escape 关闭', async () => {
    const wrapper = mountHeader()
    const menu = wrapper.get('[aria-controls="mobile-navigation"]')

    await menu.trigger('click')
    expect(menu.attributes('aria-expanded')).toBe('true')
    expect(menu.attributes('aria-label')).toBe('关闭菜单')
    expect(document.activeElement).toBe(wrapper.get('#mobile-navigation a').element)
    expect(wrapper.get('#mobile-navigation a[href="/"]').attributes('aria-current')).toBe('page')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(menu.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(menu.element)
    wrapper.unmount()
  })
})
