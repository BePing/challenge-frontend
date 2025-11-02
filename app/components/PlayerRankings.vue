<template>
  <Card>
    <CardHeader class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-sm text-muted-foreground" v-if="selectedLevelInfo">
            Niveau: {{ selectedLevelInfo.name }} • {{ selectedLevelInfo.playerCount }} joueurs
          </p>
        </div>
        <div class="flex items-center gap-3">
          <PlayerSearch v-model="searchQuery" :loading="loadingSearch" />
        </div>
      </div>
      
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="levelOption in levels"
            :key="levelOption.code"
            :variant="level === levelOption.code ? 'default' : 'outline'"
            :class="[
              'h-auto px-4 py-2 text-center transition-all',
              level === levelOption.code 
                ? 'ring-2 ring-primary ring-offset-1' 
                : 'hover:bg-muted'
            ]"
            size="sm"
            @click="selectLevel(levelOption.code)"
          >
            <div class="flex items-center gap-2">
              <div class="font-bold text-sm">{{ levelOption.code }}</div>
              <Badge variant="secondary" class="text-xs">
                {{ levelOption.playerCount }}
              </Badge>
            </div>
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="rounded-md border overflow-x-auto">
        <Table class="min-w-[640px]">
          <TableHeader>
            <TableRow class="bg-muted/50">
              <TableHead class="w-20 text-left">Position</TableHead>
              <TableHead class="text-left">Joueur</TableHead>
              <TableHead class="text-left">Club</TableHead>
              <TableHead class="text-right w-32">Points</TableHead>
              <TableHead class="text-center w-24">Matchs</TableHead>
              <TableHead class="text-right w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          <!-- Loading skeleton rows -->
          <template v-if="loading">
            <TableRow v-for="i in 8" :key="`skeleton-${i}`">
              <TableCell class="text-left">
                <div class="flex items-center gap-2">
                  <Skeleton class="h-6 w-12 rounded" />
                  <Skeleton class="h-4 w-4 rounded" />
                </div>
              </TableCell>
              <TableCell class="text-left">
                <div class="space-y-1">
                  <Skeleton class="h-4 w-32" />
                  <Skeleton class="h-3 w-16" />
                </div>
              </TableCell>
              <TableCell class="text-left">
                <Skeleton class="h-4 w-24" />
              </TableCell>
              <TableCell class="text-right">
                <div class="space-y-1 flex flex-col items-end">
                  <Skeleton class="h-4 w-12" />
                  <Skeleton class="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell class="text-center">
                <Skeleton class="h-6 w-12 mx-auto rounded" />
              </TableCell>
              <TableCell class="text-right">
                <Skeleton class="h-8 w-20 rounded ml-auto" />
              </TableCell>
            </TableRow>
          </template>
          
          <!-- Actual player data -->
          <template v-else>
            <TableRow 
              v-for="player in filteredPlayers" 
              :key="player.uniqueIndex"
              :id="`player-row-${player.uniqueIndex}`"
              :class="[
                'hover:bg-muted/50 transition-colors',
                isPlayerHighlighted(player) && 'bg-primary/10 ring-2 ring-primary'
              ]"
            >
              <TableCell class="text-left">
                <div class="flex items-center gap-2">
                  <Badge 
                    :variant="getPositionVariant(player.position)" 
                    class="font-mono text-sm min-w-[3rem] justify-center"
                  >
                    #{{ player.position }}
                  </Badge>
                  <TrendingUp v-if="player.positionChange && player.positionChange > 0" class="h-4 w-4 text-green-500 flex-shrink-0" />
                  <TrendingDown v-else-if="player.positionChange && player.positionChange < 0" class="h-4 w-4 text-red-500 flex-shrink-0" />
                </div>
              </TableCell>
              <TableCell class="text-left">
                <div class="space-y-1">
                  <div class="font-semibold">{{ player.name }}</div>
                  <div class="text-xs text-muted-foreground font-mono">#{{ player.uniqueIndex }}</div>
                </div>
              </TableCell>
              <TableCell class="text-left">
                <div class="font-medium">{{ player.clubName }}</div>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex flex-col items-end space-y-1">
                  <div class="font-bold text-lg">{{ player.points.total }}</div>
                  <PointsBreakdown :points="formatPointsBreakdown(player.points.breakdown)" size="sm" />
                </div>
              </TableCell>
              <TableCell class="text-center">
                <Badge variant="outline" class="font-medium">
                  {{ getMatchesPlayed(player.points.breakdown) }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end">
                  <Button variant="outline" size="sm" @click="openPlayerDetails(player)" class="gap-2">
                    <Eye class="h-4 w-4" />
                    <span class="hidden sm:inline">Détails</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
        </Table>
      </div>
      
      <div v-if="hasMore" class="mt-6 text-center">
        <Button :disabled="loadingMore" @click="loadMorePlayers">
          <Loader2 v-if="loadingMore" class="h-4 w-4 mr-2 animate-spin" />
          Charger Plus de Joueurs
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Loader2, Eye } from 'lucide-vue-next'

const props = defineProps({
  region: String,
  level: String,
  week: Number
})

const emit = defineEmits(['update:level'])

const searchQuery = ref('')
const loadingMore = ref(false)
const loading = ref(true)
const openPlayerModal = inject('openPlayerModal')

const { getRankings, getAllRankings, getNextPage, resetPagination, hasMore } = useRankings()
const players = ref([])
const allPlayers = ref([]) // Store all players for search
const highlightedPlayerId = ref(null)
const loadingSearch = ref(false)

// Watch for search query changes - load all players when user searches
watch(searchQuery, async (newQuery) => {
  if (newQuery && newQuery.length > 0 && allPlayers.value.length === 0) {
    // Load all players for search when user starts typing
    loadingSearch.value = true
    try {
      const allRankings = await getAllRankings(props.region, props.level, props.week)
      allPlayers.value = allRankings.map(r => ({
        ...r,
        positionChange: 0,
        totalPoints: r.points.total,
        matchesPlayed: getMatchesPlayed(r.points.breakdown)
      }))
    } catch (err) {
      console.error('Failed to load all rankings for search:', err)
    } finally {
      loadingSearch.value = false
    }
  }
})

const filteredPlayers = computed(() => {
  if (!searchQuery.value) {
    highlightedPlayerId.value = null
    return players.value
  }
  
  // Use allPlayers for search if available, otherwise fallback to loaded players
  const searchSource = allPlayers.value.length > 0 ? allPlayers.value : players.value
  
  const query = searchQuery.value.toLowerCase()
  const matches = searchSource.filter(player => 
    player.name.toLowerCase().includes(query) || 
    player.clubName.toLowerCase().includes(query) ||
    player.uniqueIndex.toString().includes(query)
  )
  
  // Highlight the first match and auto-scroll
  if (matches.length > 0) {
    highlightedPlayerId.value = matches[0].uniqueIndex
    // Auto-scroll to highlighted player
    nextTick(() => {
      scrollToPlayer(matches[0].uniqueIndex)
    })
  } else {
    highlightedPlayerId.value = null
  }
  
  return matches
})

const isPlayerHighlighted = (player) => {
  return highlightedPlayerId.value === player.uniqueIndex
}

const scrollToPlayer = (uniqueIndex) => {
  const element = document.getElementById(`player-row-${uniqueIndex}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const getPositionVariant = (position) => {
  if (position <= 3) return 'default'
  if (position <= 10) return 'secondary'
  return 'outline'
}

const openPlayerDetails = (player) => {
  openPlayerModal(player)
}

const loadRankings = async () => {
  if (!props.region || !props.level || !props.week) return
  
  loading.value = true
  resetPagination()
  allPlayers.value = [] // Clear cached search results when changing region/level
  
  try {
    const rankings = await getRankings(props.region, props.level, props.week)
    
    // Small delay to ensure smooth transition (prevents flicker)
    await new Promise(resolve => setTimeout(resolve, 50))
    
    players.value = rankings.map(r => ({
      ...r,
      positionChange: 0, // Could calculate from history if needed
      totalPoints: r.points.total,
      matchesPlayed: getMatchesPlayed(r.points.breakdown)
    }))
  } catch (err) {
    console.error('Failed to load rankings:', err)
  } finally {
    // Additional small delay before hiding skeleton
    setTimeout(() => {
      loading.value = false
    }, 100)
  }
}

const loadMorePlayers = async () => {
  if (!props.region || !props.level || !props.week) return
  
  loadingMore.value = true
  try {
    const nextRankings = await getNextPage(props.region, props.level, props.week)
    const newPlayers = nextRankings.map(r => ({
      ...r,
      positionChange: 0,
      totalPoints: r.points.total,
      matchesPlayed: getMatchesPlayed(r.points.breakdown)
    }))
    players.value = [...players.value, ...newPlayers]
  } catch (err) {
    console.error('Failed to load more players:', err)
  } finally {
    loadingMore.value = false
  }
}

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

const getMatchesPlayed = (breakdown) => {
  if (!breakdown) return 0
  return (breakdown.count5Pts || 0) + 
         (breakdown.count3Pts || 0) + 
         (breakdown.count2Pts || 0) + 
         (breakdown.count1Pts || 0) + 
         (breakdown.count0Pts || 0)
}

const selectLevel = (levelCode) => {
  emit('update:level', levelCode)
}

const { getRegionSummary } = useRegionSummary()
const levels = ref([])

// Level name mappings
const levelNames = {
  'NAT_WB': 'National WB',
  'Provincial 1': 'Provincial 1',
  'P1': 'Provincial 1',
  'Provincial 2': 'Provincial 2',
  'P2': 'Provincial 2',
  'Provincial 3': 'Provincial 3',
  'P3': 'Provincial 3',
  'Provincial 4': 'Provincial 4',
  'P4': 'Provincial 4',
  'Provincial 5': 'Provincial 5',
  'P5': 'Provincial 5',
  'Provincial 6': 'Provincial 6',
  'P6': 'Provincial 6'
}

// Level colors
const levelColors = {
  'NAT_WB': 'red',
  'Provincial 1': 'orange',
  'P1': 'orange',
  'Provincial 2': 'yellow',
  'P2': 'yellow',
  'Provincial 3': 'green',
  'P3': 'green',
  'Provincial 4': 'blue',
  'P4': 'blue',
  'Provincial 5': 'indigo',
  'P5': 'indigo',
  'Provincial 6': 'purple',
  'P6': 'purple'
}

// Load levels from region summary
const loadLevels = async () => {
  if (!props.region || !props.week) return
  
  try {
    const regionSummary = await getRegionSummary(props.region, props.week)
    
    if (regionSummary && regionSummary.playersByLevel) {
      // Convert playersByLevel object to array of levels, filtering out "N/A"
      const levelsList = Object.keys(regionSummary.playersByLevel)
        .filter(levelCode => levelCode !== 'N/A' && levelCode !== 'NA')
        .map(levelCode => ({
          code: levelCode,
          name: levelNames[levelCode] || levelCode,
          playerCount: regionSummary.playersByLevel[levelCode] || 0,
          color: levelColors[levelCode] || 'gray',
          description: `${levelNames[levelCode] || levelCode} - ${regionSummary.playersByLevel[levelCode]} joueurs`
        }))
        .sort((a, b) => {
          // Sort: NAT_WB first, then P1-P6
          if (a.code === 'NAT_WB') return -1
          if (b.code === 'NAT_WB') return 1
          return a.code.localeCompare(b.code)
        })
      
      levels.value = levelsList
      
      // Auto-select first level if none selected
      if (!props.level && levelsList.length > 0) {
        emit('update:level', levelsList[0].code)
      }
    }
  } catch (error) {
    console.error('Failed to load levels:', error)
  }
}

const selectedLevelInfo = computed(() => {
  return levels.value.find(levelOption => levelOption.code === props.level)
})

// Watch for prop changes and reload rankings
watch([() => props.region, () => props.level, () => props.week], () => {
  loadRankings()
}, { immediate: true })

// Watch for region/week changes to reload levels
watch([() => props.region, () => props.week], () => {
  loadLevels()
}, { immediate: true })

onMounted(() => {
  loadLevels()
  loadRankings()
})
</script>

<style scoped>
/* Prevent flicker by ensuring smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>