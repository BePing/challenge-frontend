<template>
  <div class="flex min-h-screen flex-col bg-pulse-bg font-sans text-pulse-ink">
    <AppNavigation />
    <main class="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-7 sm:py-7">
      <slot />
    </main>
    <footer class="border-t border-pulse-line bg-pulse-surface">
      <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-7">
        <div class="flex items-center gap-2">
          <BepingMark :size="18" />
          <span class="font-display text-sm font-extrabold tracking-[-0.4px]">BePing</span>
        </div>
        <p class="text-xs text-pulse-ink2">
          © {{ new Date().getFullYear() }} Challenges BePing · Développé par
          <span class="font-semibold text-pulse-ink">Florent Cardoen</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavigation from '@/components/AppNavigation.vue'
</script>
