<template>
  <div class="relative w-full sm:w-64">
    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    <Input
      v-model="searchValue"
      type="text"
      placeholder="Rechercher un joueur..."
      :class="['pl-10', searchValue ? 'pr-10' : 'pr-10']"
    />
    <Loader2
      v-if="props.loading"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary animate-spin pointer-events-none"
    />
    <button
      v-else-if="searchValue"
      @click="clearSearch"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      type="button"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup>
import { Search, X, Loader2 } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

const props = defineProps({
  modelValue: String,
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const clearSearch = () => {
  searchValue.value = ''
}
</script>
