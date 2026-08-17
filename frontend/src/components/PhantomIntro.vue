<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { usePhantomIntro } from '@/composables/usePhantomIntro'
import { useLocale } from '@/composables/useLocale'
import { useSound } from '@/composables/useSound'
import PhantomEyeMark from './PhantomEyeMark.vue'

const { stage, isPlaying, shouldAutoPlay, motion, playIntro, skipIntro } = usePhantomIntro()
const { playIntroCue } = useSound()
const { t } = useLocale()
let previousOverflow = ''

/** 允许键盘用户随时跳过阻断式开场。 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isPlaying.value) skipIntro()
}

watch(stage, (nextStage) => {
  playIntroCue(nextStage)
})

watch(isPlaying, (playing) => {
  if (playing) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }
  document.body.style.overflow = previousOverflow
})

const handleVisibilityChange = () => {
  if (document.hidden && isPlaying.value) skipIntro()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  if (shouldAutoPlay.value) void playIntro()
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (isPlaying.value) skipIntro()
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <div
    class="phantom-intro"
    :class="[`is-${stage}`, `motion-${motion}`]"
    :data-stage="stage"
    :data-motion="motion"
    :aria-hidden="!isPlaying"
    data-testid="phantom-intro"
    @click.self="skipIntro"
  >
    <div class="phantom-intro__shard phantom-intro__shard--top"></div>
    <div class="phantom-intro__gaze">
      <PhantomEyeMark :stage="stage" />
    </div>
    <div class="phantom-intro__shard phantom-intro__shard--bottom"></div>
    <button v-if="isPlaying" class="phantom-intro__skip" type="button" @click="skipIntro">
      {{ t.home.opening.skip }}
    </button>
  </div>
</template>

<style scoped>
.phantom-intro {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: #0a0909;
  background: var(--phantom-red);
  pointer-events: none;
  visibility: hidden;
}

.phantom-intro:not(.is-brand-lock) {
  pointer-events: auto;
  visibility: visible;
}

.phantom-intro__gaze {
  position: relative;
  z-index: 2;
  width: min(76vw, 760px);
  opacity: 0;
  transform: scale(.82) rotate(-2deg);
  transition: opacity 100ms linear, transform 220ms cubic-bezier(.2, .8, .2, 1);
}

.is-gaze .phantom-intro__gaze,
.is-collapse .phantom-intro__gaze {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.is-collapse .phantom-intro__gaze {
  transform: translate(-36vw, -38vh) scale(.12) rotate(-8deg);
}

.phantom-intro__shard {
  position: absolute;
  inset-inline: -8%;
  height: 58%;
  background: #0a0909;
  transition: transform 180ms cubic-bezier(.7, 0, .3, 1);
}

.phantom-intro__shard--top {
  top: -8%;
  clip-path: polygon(0 0, 100% 0, 100% 68%, 72% 79%, 48% 66%, 24% 84%, 0 70%);
}

.phantom-intro__shard--bottom {
  bottom: -8%;
  clip-path: polygon(0 30%, 24% 16%, 48% 34%, 72% 21%, 100% 32%, 100% 100%, 0 100%);
}

.is-split .phantom-intro__shard--top,
.is-gaze .phantom-intro__shard--top {
  transform: translateY(-29%);
}

.is-split .phantom-intro__shard--bottom,
.is-gaze .phantom-intro__shard--bottom {
  transform: translateY(29%);
}

.phantom-intro__skip {
  position: absolute;
  z-index: 3;
  right: 24px;
  bottom: 24px;
  border: 2px solid #fff9e8;
  padding: 10px 14px;
  color: #fff9e8;
  background: #0a0909;
  font: inherit;
  cursor: pointer;
}

.motion-reduced .phantom-intro__gaze {
  opacity: 1;
  transform: none;
  transition: opacity 160ms linear;
}

.motion-reduced .phantom-intro__shard {
  transform: none;
  transition: none;
}

@media (max-width: 640px) {
  .phantom-intro__gaze {
    width: 92vw;
  }
}
</style>
