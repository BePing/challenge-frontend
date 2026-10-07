<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" :stroke="color" stroke-width="2.5" />
    <circle cx="12" cy="12" r="3" fill="#2F4DFF" />
    <path d="M12 2v6M12 16v6M2 12h6M16 12h6" :stroke="color" stroke-width="2.5" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number; color?: string }>(), {
  size: 24,
  color: '#0A0E1A',
})
</script>
