import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PostComments from './PostComments.vue'
import { getComments, postComment, type CommentItem } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  getComments: vi.fn(),
  postComment: vi.fn(),
  deleteComment: vi.fn(),
}))

const mockGetComments = vi.mocked(getComments)
const mockPostComment = vi.mocked(postComment)

const comment = (overrides: Partial<CommentItem>): CommentItem => ({
  id: 1,
  postSlug: 'hello-world',
  parentId: null,
  nickname: 'alice',
  content: 'nice post',
  createdAt: '2026-08-16T10:00:00Z',
  replyCount: 0,
  ...overrides,
})

const mountComments = async () => {
  const wrapper = mount(PostComments, { props: { postSlug: 'hello-world' } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetComments.mockResolvedValue({ items: [], total: 0 })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PostComments 评论区', () => {
  it('加载后展示评论列表（一级评论 + 回复）', async () => {
    mockGetComments.mockResolvedValue({
      items: [
        comment({ id: 1, content: 'root comment' }),
        comment({ id: 2, parentId: 1, content: 'a reply' }),
      ],
      total: 2,
    })

    const wrapper = await mountComments()

    expect(mockGetComments).toHaveBeenCalledWith('hello-world')
    expect(wrapper.findAll('.comment-item').length).toBe(2)
    expect(wrapper.find('.comment-item .comment-body').text()).toContain('root comment')
    expect(wrapper.find('.comment-item.is-reply .comment-body').text()).toContain('a reply')
  })

  it('空评论时展示空态文案', async () => {
    const wrapper = await mountComments()

    expect(wrapper.find('.comments-empty').exists()).toBe(true)
    expect(wrapper.find('.comments-empty').text()).toContain('还没有评论')
  })

  it('加载失败时展示错误信息', async () => {
    mockGetComments.mockRejectedValue(new Error('boom'))
    const wrapper = await mountComments()

    expect(wrapper.find('.comments-status.is-error').exists()).toBe(true)
    expect(wrapper.find('.comments-status.is-error').text()).toContain('评论加载失败')
  })

  it('填写昵称与内容后可提交评论并刷新列表', async () => {
    mockGetComments.mockResolvedValueOnce({ items: [], total: 0 })
    const created = comment({ id: 10, nickname: 'bob', content: 'first!' })
    mockPostComment.mockResolvedValue(created)
    mockGetComments.mockResolvedValueOnce({ items: [created], total: 1 })

    const wrapper = await mountComments()
    await wrapper.find('input[type="text"]').setValue('bob')
    await wrapper.find('textarea').setValue('first!')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(mockPostComment).toHaveBeenCalledWith('hello-world', {
      nickname: 'bob',
      email: undefined,
      content: 'first!',
      parentId: undefined,
    })
    expect(wrapper.find('.comment-item .comment-author').text()).toBe('bob')
  })

  it('回复一级评论时携带 parentId', async () => {
    mockGetComments.mockResolvedValue({
      items: [comment({ id: 7, nickname: 'alice', content: 'root' })],
      total: 1,
    })
    const wrapper = await mountComments()

    await wrapper.find('.comment-reply-btn').trigger('click')
    await wrapper.find('input[type="text"]').setValue('carol')
    await wrapper.find('textarea').setValue('thanks alice')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(mockPostComment).toHaveBeenCalledWith('hello-world', {
      nickname: 'carol',
      email: undefined,
      content: 'thanks alice',
      parentId: 7,
    })
  })

  it('提交失败时展示错误提示且不刷新列表', async () => {
    mockGetComments.mockResolvedValueOnce({ items: [], total: 0 })
    mockPostComment.mockRejectedValue(new Error('validation failed'))

    const wrapper = await mountComments()
    await wrapper.find('input[type="text"]').setValue('bob')
    await wrapper.find('textarea').setValue('oops')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.form-error').text()).toContain('提交失败')
  })
})
