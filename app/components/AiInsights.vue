<template>
  <Alert>
    <Sparkles class="h-4 w-4" />
    <AlertTitle>Analyses IA Hebdomadaires</AlertTitle>
    <AlertDescription>
      <template v-if="loading">
        <div class="space-y-3 sm:space-y-4">
          <Skeleton class="h-4 w-3/4" />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Skeleton class="h-5 w-32 mb-2 sm:mb-3" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-full" />
                <Skeleton class="h-4 w-5/6" />
                <Skeleton class="h-4 w-4/5" />
              </div>
            </div>
            
            <div>
              <Skeleton class="h-5 w-24 mb-2 sm:mb-3" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-full" />
                <Skeleton class="h-4 w-5/6" />
                <Skeleton class="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <template v-else-if="summary">
        <div class="space-y-3 sm:space-y-4">
          <p v-if="summary.keyInsights">{{ summary.keyInsights }}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div v-if="summary.highlights && summary.highlights.length > 0">
              <h4 class="font-medium mb-2 sm:mb-3 flex items-center">
                <Flame class="h-4 w-4 text-orange-500 mr-1" />
                À retenir
              </h4>
              <ul class="space-y-2">
                <li 
                  v-for="highlight in summary.highlights" 
                  :key="highlight"
                  class="flex items-start text-sm"
                >
                  <CheckCircle class="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <div v-if="summary.trends && summary.trends.length > 0">
              <h4 class="font-medium mb-2 sm:mb-3 flex items-center">
                <TrendingUp class="h-4 w-4 text-blue-500 mr-1" />
                Tendances
              </h4>
              <ul class="space-y-2">
                <li 
                  v-for="trend in summary.trends" 
                  :key="trend"
                  class="flex items-start text-sm"
                >
                  <TrendingUp class="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  {{ trend }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
      
      <template v-else>
        <p class="text-muted-foreground">Aucune analyse IA disponible pour le moment.</p>
      </template>
    </AlertDescription>
  </Alert>
</template>

<script setup>
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, Flame, CheckCircle, TrendingUp } from 'lucide-vue-next'

const props = defineProps({
  summary: Object,
  loading: {
    type: Boolean,
    default: false
  }
})
</script>