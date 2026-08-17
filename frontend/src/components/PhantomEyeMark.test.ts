import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhantomEyeMark from './PhantomEyeMark.vue'

describe('PhantomEyeMark 眼标', () => {
  it('使用原创内联 SVG 呈现 D 与 B 双瞳孔', () => {
    const wrapper = mount(PhantomEyeMark)

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('[data-eye="left"][data-pupil="d"]').exists()).toBe(true)
    expect(wrapper.find('[data-eye="right"][data-pupil="b"]').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('默认作为装饰图形隐藏于辅助技术', () => {
    const wrapper = mount(PhantomEyeMark)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg').attributes('focusable')).toBe('false')
  })

  it('品牌锁定状态暴露稳定状态标记', () => {
    const wrapper = mount(PhantomEyeMark, { props: { stage: 'brand-lock' } })

    expect(wrapper.attributes('data-stage')).toBe('brand-lock')
    expect(wrapper.classes()).toContain('is-brand-locked')
  })
})
