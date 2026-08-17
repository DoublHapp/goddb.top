<script setup lang="ts">
import { computed } from 'vue'
import type { PhantomIntroStage } from '@/composables/usePhantomIntro'

/** Phantom DB 双眼标识的展示属性。 */
const props = withDefaults(defineProps<{
  stage?: PhantomIntroStage
}>(), {
  stage: 'idle',
})

const classes = computed(() => ({ 'is-brand-locked': props.stage === 'brand-lock' }))
</script>

<template>
  <span
    class="phantom-eye-mark"
    :class="classes"
    :data-stage="stage"
    data-testid="phantom-eye-mark"
    aria-hidden="true"
  >
    <svg viewBox="0 0 160 72" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path class="eye-sclera" d="M5 34C20 8 52 4 76 30 58 60 25 65 5 34Z" />
      <path class="eye-sclera" d="M155 34C140 8 108 4 84 30c18 30 51 35 71 4Z" />
      <g data-eye="left" data-pupil="d" transform="translate(31 17)">
        <path class="pupil" fill-rule="evenodd" d="M0 0h17c17 0 25 9 25 19S34 38 17 38H0V0Zm12 9v20h5c8 0 12-4 12-10S25 9 17 9h-5Z" />
      </g>
      <g data-eye="right" data-pupil="b" transform="translate(91 17)">
        <path class="pupil" fill-rule="evenodd" d="M0 0h21c11 0 17 4 17 10 0 4-2 7-6 9 6 2 9 5 9 9 0 7-7 10-20 10H0V0Zm12 8v7h8c4 0 6-1 6-4s-2-3-6-3h-8Zm0 15v7h9c5 0 7-1 7-4s-2-3-7-3h-9Z" />
      </g>
      <path class="eye-cut" d="m2 37 72-16M158 37 86 21" />
    </svg>
  </span>
</template>

<style scoped>
.phantom-eye-mark {
  display: inline-grid;
  width: 100%;
  place-items: center;
  color: currentColor;
}

.phantom-eye-mark svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.eye-sclera {
  fill: #fff9e8;
  stroke: currentColor;
  stroke-width: 5;
  stroke-linejoin: bevel;
}

.pupil {
  fill: currentColor;
}

.eye-cut {
  fill: none;
  stroke: #e62724;
  stroke-width: 5;
}

.is-brand-locked {
  color: #0a0909;
}
</style>
