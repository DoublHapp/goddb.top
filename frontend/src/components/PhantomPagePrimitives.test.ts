import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhantomEmptyState from './PhantomEmptyState.vue'
import PhantomFilterBar from './PhantomFilterBar.vue'
import PhantomPageLead from './PhantomPageLead.vue'

const RouterLink = { props: ['to'], template: '<a :href="to"><slot /></a>' }

describe('Phantom 页面原语', () => {
  it('页面封面输出唯一一级标题和频道信息', () => {
    const wrapper = mount(PhantomPageLead, { props: { index: '01', eyebrow: 'ESSAYS', title: '随笔', description: '稿件索引', count: '6 FILES' } })
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.text()).toContain('6 FILES')
  })

  it('筛选台保持搜索与筛选事件契约', async () => {
    const wrapper = mount(PhantomFilterBar, { props: { search: '', placeholder: '搜索', filterLabel: '筛选', options: [{ value: 'all', label: '全部' }, { value: 'online', label: '在线' }], active: 'all', clearLabel: '清除' } })
    await wrapper.get('input').setValue('DB')
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['DB'])
    expect(wrapper.emitted('select')?.[0]).toEqual(['online'])
  })

  it('空态支持路由动作和本地清除动作', async () => {
    const link = mount(PhantomEmptyState, { props: { code: '404', title: '中断', action: '返回', to: '/' }, global: { stubs: { RouterLink } } })
    expect(link.get('a').attributes('href')).toBe('/')
    const local = mount(PhantomEmptyState, { props: { code: 'EMPTY', title: '无结果', action: '清除' }, global: { stubs: { RouterLink } } })
    await local.get('button').trigger('click')
    expect(local.emitted('action')).toHaveLength(1)
  })
})
