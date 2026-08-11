<template>
  <div class="min-h-screen bg-background flex flex-col">
    <AppNavigation />
    <main class="container mx-auto py-4 sm:py-8 px-3 sm:px-4 flex-1">
      <slot />
    </main>
    <footer class="">
      <div class="container mx-auto px-4 py-12">
        
        
        <!-- Copyright -->
        <div class="border-t pt-8">
          <p class="text-center text-sm text-muted-foreground">
            © {{ new Date().getFullYear() }} Challenges Beping. Développé par
            <span class="font-semibold text-foreground">Florent Cardoen</span>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavigation from '@/components/AppNavigation.vue'
</script>
