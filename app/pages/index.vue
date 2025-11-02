<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="text-center space-y-6 py-8">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
        <Trophy class="h-10 w-10 text-primary" />
      </div>
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
        Top 6
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Consultez les classements de toutes les séries pour les différents Top 6 
      </p>
      <div class="flex items-center justify-center gap-3">
        <Badge variant="secondary" class="text-sm px-4 py-2">
          <Calendar class="h-4 w-4 mr-2" />
          Semaine {{ currentWeek }}
        </Badge>
      </div>
    </div>

    <!-- Regions Grid -->
    <div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <NuxtLink 
          v-for="region in regions" 
          :key="region.code"
          :to="`/region/${region.code.toLowerCase().replace(/_/g, '-')}`"
          class="group block p-6 rounded-lg border border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer bg-card h-full"
        >
          <h3 class="text-xl font-semibold group-hover:text-primary transition-colors mb-4">
            {{ region.name }}
          </h3>
          <div class="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
            Voir les classements
            <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, MapPin, Users, ArrowRight } from 'lucide-vue-next'

const { currentWeek, regions } = useChampionship()

useSeoMeta({
  title: 'Top 6 - Classements Tennis de Table',
  description: 'Consultez les classements Top 6 du tennis de table belge. Accédez aux rankings des régions : Liège, Huy-Waremme et Verviers.',
  ogTitle: 'Top 6 - Classements Tennis de Table',
  ogDescription: 'Consultez les classements Top 6 du tennis de table belge. Accédez aux rankings des régions : Liège, Huy-Waremme et Verviers.'
})
</script>