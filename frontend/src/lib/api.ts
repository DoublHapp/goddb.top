const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export interface CommentItem {
  id: number
  postSlug: string
  parentId: number | null
  nickname: string
  content: string
  createdAt: string
  replyCount: number
}

export interface CommentList {
  items: CommentItem[]
  total: number
}

export interface CommentPayload {
  nickname: string
  email?: string
  content: string
  parentId?: number
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
  } catch {
    throw new ApiError(0, 'network error')
  }
  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json() as { message?: string }
      if (body.message) message = body.message
    } catch {
      // 忽略响应体解析失败，使用默认消息
    }
    throw new ApiError(response.status, message)
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}

export const getComments = (slug: string): Promise<CommentList> =>
  request(`/api/posts/${encodeURIComponent(slug)}/comments`)

export const postComment = (slug: string, payload: CommentPayload): Promise<CommentItem> =>
  request(`/api/posts/${encodeURIComponent(slug)}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const deleteComment = (id: number, token: string): Promise<void> =>
  request(`/api/admin/comments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
