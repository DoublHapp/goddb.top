import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'

const route = reactive({ path: '/', fullPath: '/' })

vi.mock('vue-router', () => ({ useRoute: () => route }))
vi.mock('@/components/SiteHeader.vue', () => ({ default: { template: '<header data-testid="site-header" />' } }))
vi.mock('@/components/SiteFooter.vue', () => ({ default: { template: '<footer data-testid="site-footer" />' } }))
vi.mock('@/components/PhantomIntro.vue', () => ({ default: { template: '<div data-testid="phantom-intro" />' } }))

beforeAll(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true })
})

const mountLayout = async () => {
  const { default: SiteLayout } = await import('./SiteLayout.vue')
  return mount(SiteLayout, {
  global: {
    stubs: {
      RouterView: { template: '<div data-testid="route-view" />' },
      SiteHeader: { template: '<header data-testid="site-header" />' },
      SiteFooter: { template: '<footer data-testid="site-footer" />' },
      PhantomIntro: { template: '<div data-testid="phantom-intro" />' },
    },
  },
  })
}

describe('SiteLayout 全站外壳', () => {
  it('普通路由接入开场、页头和页脚', async () => {
    route.path = '/'
    route.fullPath = '/'
    const wrapper = await mountLayout()

    expect(wrapper.find('[data-testid="phantom-intro"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="site-header"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="site-footer"]').exists()).toBe(true)
  })

  it('DBverse 路由不加载 Phantom 开场和站点页脚', async () => {
    route.path = '/dbverse'
    route.fullPath = '/dbverse'
    const wrapper = await mountLayout()

    expect(wrapper.classes()).toContain('site-frame--dbverse')
    expect(wrapper.find('[data-testid="phantom-intro"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="site-footer"]').exists()).toBe(false)
  })
})
