<template>
  <Sheet v-model:open="isOpen">
    <SheetContent side="right" class="w-full sm:max-w-2xl overflow-y-auto">
      <SheetHeader v-if="player" class="mb-6">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1 flex-1">
            <SheetTitle class="text-2xl font-bold tracking-tight">{{ player.name }}</SheetTitle>
            <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div class="flex items-center gap-1.5">
                <Building2 class="h-4 w-4" />
                <span class="font-medium">{{ player.clubName || player.club }}</span>
              </div>
              <Separator orientation="vertical" class="h-4" />
              <div class="flex items-center gap-1.5">
                <Hash class="h-4 w-4" />
                <span class="font-mono">{{ player.uniqueIndex }}</span>
              </div>
            </div>
          </div>
          <Badge variant="default" class="text-base px-4 py-1.5 shrink-0">
            <Trophy class="h-4 w-4 mr-1.5" />
            Position #{{ player.position }}
          </Badge>
        </div>
      </SheetHeader>

      <div class="space-y-8 min-h-[400px]">
        <template v-if="loading">
          <div class="grid grid-cols-2 gap-4">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-32 w-full col-span-2" />
          </div>
          <Skeleton class="h-40 w-full" />
          <Skeleton class="h-64 w-full" />
        </template>
        
        <template v-else-if="player">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 gap-4">
            <Card class="border-2">
              <CardContent class="pt-6">
                <div class="text-center space-y-2">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 mb-2">
                    <TrendingUp class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ getTotalPoints }}</div>
                  <div class="text-xs font-medium text-muted-foreground">Points Totaux</div>
                </div>
              </CardContent>
            </Card>
            
            <Card class="border-2">
              <CardContent class="pt-6">
                <div class="text-center space-y-2">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 mb-2">
                    <Activity class="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ getMatchesPlayed }}</div>
                  <div class="text-xs font-medium text-muted-foreground">Matchs Joués</div>
                </div>
              </CardContent>
            </Card>

            <Card v-if="playerDetails && playerDetails.points?.length > 0" class="border-2 col-span-2">
              <CardContent class="pt-6">
                <div class="text-center space-y-2">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 mb-2">
                    <Target class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {{ averagePoints.toFixed(1) }}
                  </div>
                  <div class="text-xs font-medium text-muted-foreground">Points Moy</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Points Breakdown -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <BarChart3 class="h-5 w-5 text-primary" />
                Répartition des Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PointsBreakdown :points="getPointsBreakdown" size="md" />
            </CardContent>
          </Card>

          <!-- Performance Stats -->
          <Card v-if="playerDetails && playerDetails.points?.length > 0">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <TrendingUp class="h-5 w-5 text-primary" />
                Statistiques de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ victories }}</div>
                  <div class="text-xs font-medium text-muted-foreground mt-1">Victoires</div>
                </div>
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ defeats }}</div>
                  <div class="text-xs font-medium text-muted-foreground mt-1">Défaites</div>
                </div>
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-2xl font-bold text-primary">{{ winRate.toFixed(0) }}%</div>
                  <div class="text-xs font-medium text-muted-foreground mt-1">Taux de Victoire</div>
                </div>
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ playerDetails.levelAttributed || 'N/A' }}</div>
                  <div class="text-xs font-medium text-muted-foreground mt-1">Niveau</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Recent Matches -->
          <Card v-if="playerDetails && playerDetails.points?.length > 0">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Clock class="h-5 w-5 text-primary" />
                Matchs Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2 max-h-80 overflow-y-auto">
                <div 
                  v-for="match in recentMatches" 
                  :key="match.id"
                  class="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <Badge 
                      :variant="match.result === 'W' ? 'default' : 'destructive'"
                      class="w-10 h-10 rounded-full flex items-center justify-center p-0 text-sm font-bold shrink-0"
                    >
                      {{ match.result }}
                    </Badge>
                    <div class="flex-1">
                      <div class="font-semibold text-sm">{{ match.club || 'Adversaire' }}</div>
                      <div class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Calendar class="h-3 w-3" />
                        Semaine {{ match.week }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold">{{ match.points }} pts</div>
                    <div class="text-xs text-muted-foreground">{{ match.victoryCount || 0 }} victoire(s)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card v-else-if="playerDetails && playerDetails.points?.length === 0">
            <CardContent class="py-12">
              <div class="text-center space-y-2">
                <Activity class="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p class="text-muted-foreground font-medium">Aucun match enregistré</p>
                <p class="text-sm text-muted-foreground">Les statistiques de match apparaîtront ici une fois disponibles.</p>
              </div>
            </CardContent>
          </Card>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { 
  Trophy, 
  Building2, 
  Hash, 
  TrendingUp, 
  Activity, 
  Target,
  BarChart3,
  Clock,
  Calendar
} from 'lucide-vue-next'
import PointsBreakdown from '@/components/PointsBreakdown.vue'

const props = defineProps({
  open: Boolean,
  player: Object
})

const emit = defineEmits(['update:open'])

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const { getPlayerDetails } = usePlayerDetails()
const loading = ref(false)
const playerDetails = ref(null)

// Load player details when modal opens and player changes
watch([() => props.open, () => props.player], async ([isOpen, player]) => {
  if (isOpen && player?.uniqueIndex) {
    await loadPlayerDetails(player.uniqueIndex)
  } else if (!isOpen) {
    // Reset when modal closes
    playerDetails.value = null
  }
}, { immediate: true })

const loadPlayerDetails = async (uniqueIndex) => {
  loading.value = true
  try {
    const details = await getPlayerDetails(uniqueIndex)
    playerDetails.value = details
  } catch (err) {
    console.error('Failed to load player details:', err)
  } finally {
    loading.value = false
  }
}

const recentMatches = computed(() => {
  if (!playerDetails.value || !playerDetails.value.points) return []
  
  return playerDetails.value.points.slice(0, 10).map((match, index) => ({
    id: index,
    result: match.pointsWon > 0 ? 'W' : 'L',
    opponent: 'Opponent',
    club: match.level || '',
    points: match.pointsWon,
    week: match.weekName,
    victoryCount: match.victoryCount,
    forfeit: match.forfeit
  }))
})

const formatPointsBreakdown = (breakdown) => {
  if (!breakdown) return { '5pt': 0, '3pt': 0, '2pt': 0, '1pt': 0, '0pt': 0 }
  return {
    '5pt': breakdown.count5Pts || 0,
    '3pt': breakdown.count3Pts || 0,
    '2pt': breakdown.count2Pts || 0,
    '1pt': breakdown.count1Pts || 0,
    '0pt': breakdown.count0Pts || 0
  }
}

const getMatchesPlayed = computed(() => {
  if (!playerDetails.value || !playerDetails.value.points) return 0
  return playerDetails.value.points.length
})

const getTotalPoints = computed(() => {
  if (!props.player) return 0
  return props.player.points?.total || props.player.totalPoints || 0
})

const getPointsBreakdown = computed(() => {
  if (!props.player) return { '5pt': 0, '3pt': 0, '2pt': 0, '1pt': 0, '0pt': 0 }
  if (props.player.points?.breakdown) {
    return formatPointsBreakdown(props.player.points.breakdown)
  }
  return { '5pt': 0, '3pt': 0, '2pt': 0, '1pt': 0, '0pt': 0 }
})

const victories = computed(() => {
  if (!playerDetails.value || !playerDetails.value.points) return 0
  return playerDetails.value.points.filter((p) => p.pointsWon > 0).length
})

const defeats = computed(() => {
  if (!playerDetails.value || !playerDetails.value.points) return 0
  return playerDetails.value.points.filter((p) => p.pointsWon === 0).length
})

const winRate = computed(() => {
  const total = getMatchesPlayed.value
  if (total === 0) return 0
  return (victories.value / total) * 100
})

const averagePoints = computed(() => {
  if (!playerDetails.value || !playerDetails.value.points || playerDetails.value.points.length === 0) return 0
  return getTotalPoints.value / playerDetails.value.points.length
})
</script>
