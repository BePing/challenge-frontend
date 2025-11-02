<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Breadcrumbs and Header -->
    <div class="space-y-2 sm:space-y-4">
      
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1">
          <div class="mb-2">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
              Top 6 - {{ regionName }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Region Summary with AI Insights -->
    <RegionSummary :region="regionCode" :week="currentWeek" />
    
    <!-- Player Rankings -->
    <PlayerRankings :region="regionCode" :level="selectedLevel" :week="currentWeek" @update:level="selectedLevel = $event" />
    
    <!-- Player Detail Modal -->
    <PlayerDetailModal v-model:open="showPlayerModal" :player="selectedPlayer" />
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MapPin, Calendar, Users, Building2, Activity, TrendingUp } from 'lucide-vue-next'

const route = useRoute()
const regionCode = route.params.id.toUpperCase().replace('-', '_')

const { currentWeek, selectedRegion, getCurrentRegionName } = useChampionship()
const selectedLevel = ref('NAT_WB')
const showPlayerModal = ref(false)
const selectedPlayer = ref(null)

// Set the selected region
selectedRegion.value = regionCode

const regionName = computed(() => getCurrentRegionName())

// Dynamic SEO for region pages
const pageTitle = computed(() => `Top 6 ${regionName.value} - Semaine ${currentWeek.value}`)
const pageDescription = computed(() => `Consultez les classements Top 6 de la région ${regionName.value} pour la semaine ${currentWeek.value}. Rankings par niveau : National WB, Provincial 1-6.`)

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: computed(() => `https://top6.beeping.com/region/${route.params.id}`)
})

provide('openPlayerModal', (player) => {
  selectedPlayer.value = player
  showPlayerModal.value = true
})
</script>