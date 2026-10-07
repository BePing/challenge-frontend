<template>
  <label class="relative flex h-10 w-full items-center gap-2 rounded-xl bg-pulse-surface px-3.5 sm:w-[260px]">
    <Search class="h-3.5 w-3.5 shrink-0 text-pulse-ink2" :stroke-width="2.2" aria-hidden="true" />
    <span class="sr-only">Rechercher un joueur ou un club</span>
    <input
      v-model="searchValue"
      type="search"
      placeholder="Joueur ou club…"
      class="min-w-0 flex-1 bg-transparent text-[13px] text-pulse-ink outline-none placeholder:text-[#7A8092] [&::-webkit-search-cancel-button]:hidden"
    >
    <Loader2 v-if="loading" class="h-4 w-4 shrink-0 animate-spin text-pulse-blue" aria-hidden="true" />
    <button
      v-else-if="searchValue"
      type="button"
      aria-label="Effacer la recherche"
      class="-mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-pulse-ink2 hover:bg-pulse-bg hover:text-pulse-ink"
      @click="searchValue = ''"
    >
      <X class="h-3.5 w-3.5" :stroke-width="2.4" />
    </button>
  </label>
</template>

<script setup lang="ts">
import { Loader2, Search, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ modelValue?: string; loading?: boolean }>(), {
  modelValue: '',
  loading: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>
