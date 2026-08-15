<script setup lang="ts">
import { CornerDownRight, MessageSquare, Send, X } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { getComments, postComment, type CommentItem } from '@/lib/api'
import { renderMarkdown } from '@/lib/markdown'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ postSlug: string }>()
const { locale, t } = useLocale()

const comments = ref<CommentItem[]>([])
const loading = ref(true)
const loadError = ref('')
const submitting = ref(false)
const submitError = ref('')
const nickname = ref('')
const email = ref('')
const content = ref('')
const replyingTo = ref<CommentItem | null>(null)

const rootComments = computed(() => comments.value.filter((comment) => comment.parentId === null))
const repliesOf = (parentId: number) => comments.value.filter((comment) => comment.parentId === parentId)

const loadComments = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const result = await getComments(props.postSlug)
    comments.value = result.items
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : String(error)
  } finally {
    loading.value = false
  }
}

const submitComment = async () => {
  if (!nickname.value.trim() || !content.value.trim()) return
  submitting.value = true
  submitError.value = ''
  try {
    await postComment(props.postSlug, {
      nickname: nickname.value.trim(),
      email: email.value.trim() || undefined,
      content: content.value.trim(),
      parentId: replyingTo.value?.id,
    })
    nickname.value = ''
    email.value = ''
    content.value = ''
    replyingTo.value = null
    await loadComments()
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : String(error)
  } finally {
    submitting.value = false
  }
}

const formatDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(loadComments)
</script>

<template>
  <section class="comments-section" :aria-label="t.comments.title">
    <div class="comments-head">
      <h2>{{ t.comments.title }}</h2>
      <span class="comments-count">{{ comments.length }} {{ t.comments.count }}</span>
    </div>

    <p v-if="loading" class="comments-status">{{ t.comments.loading }}</p>
    <p v-else-if="loadError" class="comments-status is-error">{{ t.comments.loadError }}: {{ loadError }}</p>
    <div v-else>
      <p v-if="!comments.length" class="comments-empty">{{ t.comments.empty }}</p>
      <div v-else class="comment-list">
        <article v-for="comment in rootComments" :key="comment.id" class="comment-item">
          <div class="comment-meta">
            <span class="comment-author">{{ comment.nickname }}</span>
            <time class="comment-time" :datetime="comment.createdAt">{{ formatDate(comment.createdAt) }}</time>
          </div>
          <div class="comment-body markdown-body" v-html="renderMarkdown(comment.content)"></div>
          <div class="comment-actions">
            <button class="comment-reply-btn" type="button" :aria-label="t.comments.reply" @click="replyingTo = replyingTo?.id === comment.id ? null : comment"><CornerDownRight :size="13" />{{ t.comments.reply }}</button>
          </div>
          <div v-if="repliesOf(comment.id).length" class="comment-replies">
            <article v-for="reply in repliesOf(comment.id)" :key="reply.id" class="comment-item is-reply">
              <div class="comment-meta">
                <span class="comment-author">{{ reply.nickname }}</span>
                <time class="comment-time" :datetime="reply.createdAt">{{ formatDate(reply.createdAt) }}</time>
              </div>
              <div class="comment-body" v-html="renderMarkdown(reply.content)"></div>
            </article>
          </div>
        </article>
      </div>
    </div>

    <form class="comments-form" novalidate @submit.prevent="submitComment">
      <h3 class="comments-form-title"><MessageSquare :size="16" />{{ replyingTo ? `${t.comments.replyTo} @${replyingTo.nickname}` : t.comments.title }}<small>{{ t.comments.emailHint }}</small></h3>
      <div class="form-row">
        <input v-model="nickname" type="text" :placeholder="t.comments.nickname" maxlength="64" required>
        <input v-model="email" type="email" :placeholder="t.comments.email" maxlength="255">
      </div>
      <textarea v-model="content" :placeholder="t.comments.contentPlaceholder" maxlength="5000" required></textarea>
      <p class="form-note">{{ t.comments.markdownHint }}</p>
      <div class="form-actions">
        <button class="submit-comment" type="submit" :disabled="submitting || !nickname.trim() || !content.trim()">
          <Send :size="14" />{{ submitting ? t.comments.submitting : t.comments.submit }}
        </button>
        <button v-if="replyingTo" class="cancel-reply" type="button" @click="replyingTo = null"><X :size="13" />{{ t.comments.cancelReply }}</button>
        <span v-if="submitError" class="form-error">{{ t.comments.submitError }}: {{ submitError }}</span>
      </div>
    </form>
  </section>
</template>
