<template>
  <aside class="flex min-w-0 flex-[1_1_280px] flex-col gap-3.5">
    <div v-if="insights && (insights.risingPlayers.length || insights.dominantClubs.length)" class="rounded-[18px] bg-pulse-surface px-5 py-[18px]">
      <h2 class="mb-2 text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">Tendances</h2>
      <ul>
        <li
          v-for="player in insights.risingPlayers"
          :key="`player-${player}`"
          class="flex items-center gap-2.5 border-b border-pulse-line py-[9px] last:border-0"
        >
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pulse-win-soft">
            <TrendingUp class="h-3.5 w-3.5 text-pulse-win-ink" :stroke-width="2.4" />
          </span>
          <div class="min-w-0">
            <div class="truncate text-[13px] font-bold">{{ displayName(player) }}</div>
            <div class="text-[11px] text-pulse-ink2">En progression</div>
          </div>
        </li>
        <li
          v-for="club in insights.dominantClubs"
          :key="`club-${club}`"
          class="flex items-center gap-2.5 border-b border-pulse-line py-[9px] last:border-0"
        >
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pulse-blue-soft">
            <Trophy class="h-3.5 w-3.5 text-pulse-blue" :stroke-width="2.2" />
          </span>
          <div class="min-w-0">
            <div class="truncate text-[13px] font-bold">{{ club }}</div>
            <div class="text-[11px] text-pulse-ink2">Club dominant</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="rounded-[18px] bg-pulse-surface px-5 py-[18px]">
      <h2 class="mb-1 text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">Lire la répartition</h2>
      <p class="mb-3 text-xs leading-[1.45] text-pulse-ink2">Nombre de rencontres par total de points obtenu.</p>
      <ul class="flex flex-col gap-2">
        <li v-for="tier in POINT_TIERS" :key="tier.key" class="flex items-center gap-2.5">
          <span :class="['h-2 w-[22px] rounded-full', tier.color]" />
          <span class="font-mono text-[11.5px] font-bold">{{ tier.label }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { TrendingUp, Trophy } from 'lucide-vue-next'
import type { RegionInsights } from '~/utils/ai-summary'
import { POINT_TIERS, displayName } from '~/utils/challenge-stats'

defineProps<{ insights: RegionInsights | null }>()
</script>
