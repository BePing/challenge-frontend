<template>
  <Card>
    <CardHeader class="pb-4">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <BarChart3 class="h-5 w-5 text-primary" />
            Niveaux de Compétition
          </CardTitle>
          <p class="text-sm text-muted-foreground mt-1">Sélectionnez un niveau pour voir les classements</p>
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Button
          v-for="level in levels"
          :key="level.code"
          :variant="modelValue === level.code ? 'default' : 'outline'"
          :class="[
            'h-auto p-4 text-center transition-all duration-200',
            modelValue === level.code 
              ? 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105' 
              : 'hover:scale-105 hover:shadow-md'
          ]"
          @click="selectLevel(level.code)"
        >
          <div class="w-full space-y-2">
            <div class="font-bold text-lg">{{ level.code }}</div>
            <div class="text-xs text-muted-foreground">
              {{ level.playerCount }} joueurs
            </div>
            <div 
              :class="[
                'h-1 w-full rounded-full mt-2',
                modelValue === level.code ? 'bg-primary/30' : 'bg-muted'
              ]"
            />
          </div>
        </Button>
      </div>

      <Alert v-if="selectedLevelInfo" class="border-primary/20 bg-primary/5">
        <Info class="h-5 w-5 text-primary" />
        <AlertTitle class="flex items-center justify-between text-base">
          <span class="font-semibold">{{ selectedLevelInfo.name }}</span>
          <Badge variant="secondary" class="text-sm">
            {{ selectedLevelInfo.playerCount }} joueurs
          </Badge>
        </AlertTitle>
        <AlertDescription class="mt-2">
          {{ selectedLevelInfo.description }}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, BarChart3 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  region: String,
  week: Number
})

const emit = defineEmits(['update:modelValue'])

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
    }
  } catch (error) {
    console.error('Failed to load levels:', error)
  }
}

const selectLevel = (levelCode) => {
  emit('update:modelValue', levelCode)
}

const selectedLevelInfo = computed(() => {
  return levels.value.find(level => level.code === props.modelValue)
})

// Watch for region/week changes and reload levels
watch([() => props.region, () => props.week], () => {
  loadLevels()
}, { immediate: true })

onMounted(() => {
  loadLevels()
})
</script>