<template>
  <div class="min-h-screen bg-background flex flex-col">
    <AppNavigation />
    <main class="container mx-auto py-8 px-4 flex-1">
      <slot />
    </main>
    <footer class="">
      <div class="container mx-auto px-4 py-12">
        
        
        <!-- Copyright -->
        <div class="border-t pt-8">
          <p class="text-center text-sm text-muted-foreground">
            © {{ new Date().getFullYear() }} Top 6. Développé par
            <span class="font-semibold text-foreground">Florent Cardoen</span>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Trophy } from 'lucide-vue-next'
import AppNavigation from '@/components/AppNavigation.vue'
import { useChampionship } from '@/composables/useChampionship'

const { regions } = useChampionship()
</script>