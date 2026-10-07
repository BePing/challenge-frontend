<template>
  <div class="min-w-0">
    <div
      class="flex h-2 gap-0.5 overflow-hidden rounded-full bg-pulse-bg"
      role="img"
      :aria-label="ariaLabel"
    >
      <span
        v-for="tier in visibleTiers"
        :key="tier.key"
        :class="tier.color"
        :style="{ width: `${tier.percent}%` }"
      />
    </div>
    <div v-if="showCounts" class="tabular mt-[5px] whitespace-nowrap font-mono text-[10px] text-pulse-ink2" aria-hidden="true">
      {{ tiers.map((tier) => tier.count).join(' · ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PointsBreakdown } from '~/types/challenge-view'
import { breakdownTiers } from '~/utils/challenge-stats'

const props = withDefaults(
  defineProps<{ breakdown?: PointsBreakdown | null; showCounts?: boolean }>(),
  { breakdown: null, showCounts: true },
)

const tiers = computed(() => breakdownTiers(props.breakdown))
const visibleTiers = computed(() => tiers.value.filter((tier) => tier.count > 0))
const ariaLabel = computed(() =>
  `Répartition : ${tiers.value.map((tier) => `${tier.count} × ${tier.label}`).join(', ')}`,
)
</script>
