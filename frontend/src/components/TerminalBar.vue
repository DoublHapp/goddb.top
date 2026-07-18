<script setup lang="ts">
defineProps<{ command: string }>()
</script>

<template>
  <div class="terminal-bar" aria-hidden="true">
    <span class="window-dot red"></span><span class="window-dot amber"></span><span class="window-dot green"></span>
    <code><span>visitor@goddb</span>:~$ {{ command }}<i></i></code>
  </div>
</template>
