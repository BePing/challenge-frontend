<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h2 class="text-lg sm:text-xl font-semibold">Aperçu {{ regionName }}</h2>
      <Badge variant="outline">Semaine {{ week }}</Badge>
    </div>
    
    <template v-if="loading">
      <Skeleton class="h-48 w-full rounded-lg" />
    </template>
    
    <template v-else-if="error">
      <div class="text-center py-8 rounded-lg border border-destructive/50 bg-destructive/10">
        <p class="text-destructive mb-2 font-medium">Erreur lors du chargement des données</p>
        <p class="text-sm text-muted-foreground">{{ error.message || 'Vérifiez vos permissions Firestore' }}</p>
      </div>
    </template>
    
    <template v-else>
      <div v-if="summary.aiSummary">
        <AiInsights :summary="summary.aiSummary" />
      </div>
      <div v-else class="text-center py-8 rounded-lg border">
        <p class="text-muted-foreground">Aucune analyse IA disponible pour le moment.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import AiInsights from '@/components/AiInsights.vue'

const props = defineProps({
  region: String,
  week: Number
})

const regionNames = {
  'LIEGE': 'Liège',
  'VERVIERS': 'Verviers',
  'HUY_WAREMME': 'Huy-Waremme'
}

const regionName = computed(() => regionNames[props.region] || props.region)

const { getRegionSummary } = useRegionSummary()
const loading = ref(true)
const error = ref(null)
const summary = ref({
  totalPlayers: 0,
  activeClubs: 0,
  totalMatches: 0,
  averagePoints: 0,
  aiSummary: null
})

// Load region summary from Firestore
const loadSummary = async () => {
  if (!props.region || !props.week) return
  
  loading.value = true
  error.value = null
  
  console.log('RegionSummary: Loading summary for', props.region, 'week', props.week)
  
  try {
    const regionSummary = await getRegionSummary(props.region, props.week)
    
    console.log('RegionSummary: Received data:', regionSummary)
    console.log('RegionSummary: AI Summary:', regionSummary?.aiSummary)
    
    if (regionSummary) {
      summary.value = {
        totalPlayers: regionSummary.totalPlayers,
        activeClubs: regionSummary.clubs?.length || 0,
        totalMatches: 0, // Calculate from player points if needed
        averagePoints: 0, // Calculate from player points if needed
        aiSummary: regionSummary.aiSummary ? {
          highlights: regionSummary.aiSummary.keyHighlights || [],
          trends: [
            ...(regionSummary.aiSummary.trends.risingPlayers || []).map(p => `${p} en progression`),
            ...(regionSummary.aiSummary.trends.dominantClubs || []).map(c => `${c} dominant`),
            `Compétitivité: ${regionSummary.aiSummary.trends.competitiveLevel}`,
          ],
          keyInsights: regionSummary.aiSummary.summary || regionSummary.aiSummary.trends.weeklyInsight || ''
        } : null
      }
      
      console.log('RegionSummary: Final summary value:', JSON.parse(JSON.stringify(summary.value)))
    } else {
      console.log('RegionSummary: No data returned from Firestore')
    }
  } catch (err) {
    error.value = err
    console.error('Failed to load region summary:', err)
  } finally {
    loading.value = false
  }
}

// Watch for region/week changes
watch([() => props.region, () => props.week], () => {
  console.log('Watch triggered, loading summary for:', props.region, props.week)
  loadSummary()
}, { immediate: true })

watch(() => summary.value, (newSummary) => {
  console.log('Summary value changed:', JSON.parse(JSON.stringify(newSummary)))
  console.log('AI summary value:', JSON.parse(JSON.stringify(newSummary.aiSummary)))
}, { deep: true })
</script>