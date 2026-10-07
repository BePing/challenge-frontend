<template>
  <section aria-label="Aperçu de la semaine" class="flex flex-wrap gap-4">
    <div v-if="loading" class="h-[260px] min-w-0 flex-[2_1_560px] animate-pulse rounded-[22px] bg-pulse-ink/90" />
    <div
      v-else
      class="relative min-w-0 flex-[2_1_560px] overflow-hidden rounded-[22px] bg-pulse-ink px-5 pb-5 pt-6 text-white sm:px-[26px]"
    >
      <div
        class="pointer-events-none absolute -right-[70px] -top-[90px] h-80 w-80 rounded-full opacity-60"
        style="background: radial-gradient(circle, #2F4DFF 0%, rgba(47, 77, 255, 0) 70%)"
      />
      <div class="relative flex items-center gap-2">
        <span class="inline-flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-white/[0.12]">
          <Sparkles v-if="insights" class="h-3.5 w-3.5 text-pulse-ball" />
          <CalendarDays v-else class="h-3.5 w-3.5 text-pulse-ball" />
        </span>
        <span class="text-[10.5px] font-extrabold uppercase tracking-[1.2px] text-white/70">
          {{ insights ? 'Analyse IA' : 'Aperçu' }} · Semaine {{ week }}
        </span>
      </div>
      <p class="relative mt-3.5 max-w-[640px] font-display text-lg font-semibold leading-[1.35] tracking-[-0.3px] sm:text-[21px]">
        {{ insights?.summary || `Classement de la semaine ${week} pour la région de ${regionName}.` }}
      </p>
      <dl class="relative mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-white/[0.12] pt-4 sm:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col-reverse">
          <dt class="mt-[5px] font-mono text-[10px] uppercase tracking-[0.8px] text-white/[0.62]">{{ stat.label }}</dt>
          <dd :class="['tabular font-display text-[28px] font-extrabold leading-none tracking-[-1px]', stat.accent && 'text-pulse-ball']">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </div>

    <div
      v-if="!loading && insights && insights.highlights.length > 0"
      class="min-w-0 flex-[1_1_320px] rounded-[18px] bg-pulse-surface px-5 py-5 sm:px-[22px]"
    >
      <h2 class="mb-3 text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">À retenir</h2>
      <ol class="flex flex-col gap-3.5">
        <li v-for="(highlight, index) in insights.highlights" :key="highlight" class="flex items-start gap-3">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-pulse-blue-soft font-mono text-[11px] font-extrabold text-pulse-blue">
            {{ index + 1 }}
          </span>
          <span class="text-[13.5px] leading-[1.45]">{{ highlight }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CalendarDays, Sparkles } from 'lucide-vue-next'
import type { RegionSummary } from '~/types/challenge-view'
import type { RegionInsights } from '~/utils/ai-summary'

const props = defineProps<{
  summary: RegionSummary | null
  insights: RegionInsights | null
  regionName: string
  week: number
  levelCount: number
  loading?: boolean
}>()

const number = new Intl.NumberFormat('fr-BE')

const stats = computed(() => {
  const summary = props.summary
  const items: Array<{ label: string; value: string; accent?: boolean }> = [
    { label: 'Joueurs', value: summary ? number.format(summary.totalPlayers) : '–' },
    { label: 'Niveaux', value: String(props.levelCount) },
    { label: 'Clubs', value: summary ? number.format(summary.clubs.length) : '–' },
  ]
  items.push(
    props.insights?.competitiveLevel
      ? { label: 'Compétitivité', value: props.insights.competitiveLevel, accent: true }
      : { label: 'Semaine', value: String(props.week), accent: true },
  )
  return items
})
</script>
