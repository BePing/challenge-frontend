<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-[rgba(10,14,26,0.5)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <DialogContent
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-pulse-bg font-sans text-pulse-ink shadow-[0_30px_80px_rgba(10,14,26,0.35)] duration-300 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right sm:inset-y-4 sm:right-4 sm:w-[440px] sm:rounded-[24px]"
      >
        <template v-if="player">
          <div class="relative overflow-hidden bg-pulse-ink px-[22px] pb-[18px] pt-5 text-white">
            <div
              class="pointer-events-none absolute -right-[60px] -top-20 h-[260px] w-[260px] rounded-full opacity-60"
              style="background: radial-gradient(circle, #2F4DFF 0%, rgba(47, 77, 255, 0) 70%)"
            />
            <div class="relative flex items-start justify-between gap-3">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-pulse-ball px-[9px] py-1 font-mono text-[11px] font-extrabold text-pulse-ink">
                  #{{ player.position }}
                </span>
                <span v-if="levelLabel" class="text-[10.5px] font-extrabold uppercase tracking-[1.1px] text-white/70">
                  {{ levelLabel }}
                </span>
              </div>
              <DialogClose
                aria-label="Fermer"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.12] text-white transition-colors hover:bg-white/20"
              >
                <X class="h-3.5 w-3.5" :stroke-width="2.6" />
              </DialogClose>
            </div>
            <DialogTitle class="relative mt-3 font-display text-[28px] font-extrabold leading-[1.05] tracking-[-1px]">
              {{ displayName(player.name) }}
            </DialogTitle>
            <DialogDescription class="relative mt-1.5 font-mono text-[11.5px] text-white/[0.68]">
              {{ player.clubName }} · #{{ player.uniqueIndex }}
            </DialogDescription>
            <div class="relative mt-4 flex items-baseline gap-2">
              <span class="tabular font-display text-[64px] font-extrabold leading-[0.85] tracking-[-3px]">{{ player.points.total }}</span>
              <span class="font-mono text-xs font-bold text-white/[0.68]">points</span>
            </div>
            <dl class="relative mt-4 grid grid-cols-4 gap-2 border-t border-white/[0.12] pt-3.5">
              <div v-for="stat in stats" :key="stat.label" class="flex flex-col-reverse">
                <dt class="mt-1 font-mono text-[9.5px] uppercase tracking-[0.8px] text-white/[0.62]">{{ stat.label }}</dt>
                <dd :class="['tabular font-display text-xl font-extrabold leading-none', stat.color]">{{ stat.value }}</dd>
              </div>
            </dl>
          </div>

          <div class="flex flex-col gap-3 p-3.5">
            <div class="flex items-center gap-[18px] rounded-2xl bg-pulse-surface px-[18px] py-4">
              <div class="relative h-[84px] w-[84px] shrink-0">
                <svg width="84" height="84" viewBox="0 0 84 84" class="-rotate-90" aria-hidden="true">
                  <circle cx="42" cy="42" r="35" stroke="#EEF0F4" stroke-width="10" fill="none" />
                  <circle
                    cx="42"
                    cy="42"
                    r="35"
                    stroke="#2F4DFF"
                    stroke-width="10"
                    fill="none"
                    stroke-linecap="round"
                    :stroke-dasharray="RING"
                    :stroke-dashoffset="RING * (1 - record.rate / 100)"
                  />
                </svg>
                <span class="tabular absolute inset-0 flex items-center justify-center font-display text-xl font-extrabold tracking-[-0.6px]">
                  {{ record.rate }}%
                </span>
              </div>
              <div class="min-w-0">
                <div class="text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">Taux de victoire</div>
                <p class="mt-1.5 text-[13px] leading-[1.45]">
                  <strong>{{ record.wins }}</strong> rencontres avec des points, <strong>{{ record.losses }}</strong> sans point
                  sur {{ record.played }} jouées.
                </p>
              </div>
            </div>

            <div class="rounded-2xl bg-pulse-surface px-[18px] py-4">
              <h3 class="mb-3 text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">Répartition des points</h3>
              <ul class="flex flex-col gap-[9px]">
                <li v-for="tier in tiers" :key="tier.key" class="grid grid-cols-[44px_minmax(0,1fr)_28px] items-center gap-2.5">
                  <span class="font-mono text-[11.5px] font-bold">{{ tier.label }}</span>
                  <span class="h-2.5 overflow-hidden rounded-full bg-pulse-bg">
                    <span :class="['block h-full rounded-full', tier.color]" :style="{ width: `${tier.percent}%` }" />
                  </span>
                  <span class="tabular text-right font-mono text-xs font-extrabold">{{ tier.count }}</span>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl bg-pulse-surface px-[18px] py-4">
              <div class="mb-3 flex items-baseline justify-between">
                <h3 class="text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">Rencontres récentes</h3>
                <span v-if="recentMatches.length" class="font-mono text-[10.5px] text-pulse-ink2">
                  S{{ recentMatches[recentMatches.length - 1].week }} → S{{ recentMatches[0].week }}
                </span>
              </div>
              <div v-if="loading" class="grid grid-cols-5 gap-1.5">
                <div v-for="index in 10" :key="index" class="h-[62px] animate-pulse rounded-[10px] bg-pulse-bg" />
              </div>
              <ol v-else-if="recentMatches.length" class="grid grid-cols-5 gap-1.5">
                <li
                  v-for="match in recentMatches"
                  :key="match.id"
                  :class="['rounded-[10px] px-1.5 py-2 text-center', match.won ? 'bg-pulse-win-soft' : 'bg-pulse-loss-soft']"
                  :title="`Semaine ${match.week} · ${match.points} pts · ${match.victories} victoire(s)`"
                >
                  <div class="font-mono text-[10px] font-bold text-pulse-ink2">S{{ match.week }}</div>
                  <div :class="['tabular mt-[3px] font-display text-lg font-extrabold', match.won ? 'text-pulse-win-ink' : 'text-pulse-loss-ink']">
                    {{ match.points }}
                  </div>
                  <div :class="['font-mono text-[9.5px] font-extrabold', match.won ? 'text-pulse-win-ink' : 'text-pulse-loss-ink']">
                    {{ match.won ? 'V' : 'D' }}
                  </div>
                </li>
              </ol>
              <p v-else class="text-[13px] text-pulse-ink2">Aucune rencontre détaillée pour ce joueur.</p>
            </div>
          </div>
        </template>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import type { PlayerPointsDetails, RankingDocument } from '~/types/challenge-view'
import { averagePoints, breakdownTiers, displayName, winLoss } from '~/utils/challenge-stats'

const RING = 2 * Math.PI * 35

const props = defineProps<{
  open: boolean
  player: RankingDocument | null
  levelLabel?: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

const { getPlayerDetails } = usePlayerDetails()
const loading = ref(false)
const playerDetails = ref<PlayerPointsDetails | null>(null)

watch(
  () => [props.open, props.player?.uniqueIndex] as const,
  async ([open, uniqueIndex]) => {
    if (!open || !uniqueIndex) {
      if (!open) playerDetails.value = null
      return
    }
    loading.value = true
    try {
      playerDetails.value = await getPlayerDetails(String(uniqueIndex))
    } catch {
      playerDetails.value = null
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const record = computed(() => winLoss(props.player?.points.breakdown))
const tiers = computed(() => breakdownTiers(props.player?.points.breakdown, 'max'))

const stats = computed(() => [
  { label: 'Matchs', value: String(record.value.played), color: '' },
  {
    label: 'Moy./match',
    value: averagePoints(props.player?.points.total ?? 0, record.value.played),
    color: 'text-pulse-ball',
  },
  { label: 'Victoires', value: String(record.value.wins), color: 'text-[#3FD68F]' },
  { label: 'Défaites', value: String(record.value.losses), color: 'text-[#FF7A72]' },
])

const recentMatches = computed(() =>
  [...(playerDetails.value?.points ?? [])]
    .sort((a, b) => b.weekName - a.weekName || b.matchUniqueId - a.matchUniqueId)
    .slice(0, 10)
    .map((point) => ({
      id: point.matchUniqueId,
      week: point.weekName,
      points: point.pointsWon,
      victories: point.victoryCount,
      won: point.pointsWon > 0,
    })),
)
</script>
