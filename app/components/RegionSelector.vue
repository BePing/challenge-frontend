<template>
  <Card>
    <CardHeader>
      <CardTitle>Select Region</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          v-for="region in regions"
          :key="region.code"
          :variant="modelValue === region.code ? 'default' : 'outline'"
          class="h-auto p-4 text-left justify-start"
          @click="selectRegion(region.code)"
        >
          <div class="w-full">
            <div class="font-semibold text-base">{{ region.name }}</div>
            <div class="text-sm text-muted-foreground mt-1">
              {{ region.playerCount }} players
            </div>
          </div>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const selectRegion = (regionCode) => {
  emit('update:modelValue', regionCode)
}

const { regions } = useChampionship()
</script>