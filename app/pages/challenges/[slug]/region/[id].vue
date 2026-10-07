<template>
  <div v-if="challenge && publication" class="flex flex-col gap-[22px]">
    <div>
      <div class="text-[11px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">
        {{ challenge.unofficialLabel }}
      </div>
      <h1 class="mt-2 font-display text-[34px] font-extrabold leading-none tracking-[-1.4px] sm:text-[44px] sm:tracking-[-1.8px]">
        {{ challenge.shortName || challenge.name }} · {{ regionName }}
      </h1>
      <p class="mt-2 font-mono text-xs text-pulse-ink2">
        Semaine {{ publication.week }} · publié le {{ publishedOn }}
      </p>
    </div>

    <RegionSummary
      :summary="summary ?? null"
      :insights="insights"
      :region-name="regionName"
      :week="publication.week"
      :level-count="levelOptions.length"
      :loading="summaryPending"
    />

    <PlayerRankings
      :region="regionCode"
      :level="selectedLevel"
      :week="publication.week"
      :levels="levelOptions"
      @update:level="selectedLevel = $event"
    >
      <template #aside>
        <RegionTrends :insights="insights" />
      </template>
    </PlayerRankings>

    <PlayerDetailModal
      v-model:open="showPlayerModal"
      :player="selectedPlayer"
      :level-label="selectedLevelLabel"
    />
  </div>
</template>

<script setup lang="ts">
import type { RankingDocument } from '~/types/challenge-view'
import { regionInsights } from '~/utils/ai-summary'
import { levelShortLabel } from '~/utils/challenge-stats'

const route = useRoute()
const { challenge, publication, selectChallenge } = useChallengeContext()
await selectChallenge(String(route.params.slug))
if (!challenge.value || !publication.value) {
  throw createError({ statusCode: 404, statusMessage: 'Classement non publié' })
}
const regionCode = String(route.params.id).toUpperCase().replaceAll('-', '_')
const regionName = computed(
  () => challenge.value?.regions.find((region) => region.code === regionCode)?.label ?? regionCode,
)

const { getRegionSummary } = useRegionSummary()
const { data: summary, pending: summaryPending } = await useAsyncData(
  `challenge-summary-${challenge.value.slug}-${regionCode}-${publication.value.week}`,
  () => getRegionSummary(regionCode, publication.value?.week ?? 0),
)
const insights = computed(() => regionInsights(summary.value?.aiSummary))

const levelOptions = computed(() =>
  (challenge.value?.levels ?? []).map((level) => ({
    code: level.code,
    shortLabel: levelShortLabel(level.code, level.label),
    count: summary.value?.playersByLevel?.[level.code],
  })),
)

const selectedLevel = ref(challenge.value.levels[0]?.code ?? '')
const showPlayerModal = ref(false)
const selectedPlayer = ref<RankingDocument | null>(null)
const selectedLevelLabel = computed(() => {
  const code = selectedPlayer.value?.level
  return levelOptions.value.find((option) => option.code === code)?.shortLabel ?? code
})
provide('openPlayerModal', (player: RankingDocument) => {
  selectedPlayer.value = player
  showPlayerModal.value = true
})

const publishedOn = computed(() =>
  publication.value
    ? new Intl.DateTimeFormat('fr-BE', { dateStyle: 'long' }).format(new Date(publication.value.publishedAt))
    : '',
)

useSeoMeta({
  title: computed(() => `${challenge.value?.name} — ${regionName.value}`),
  description: computed(() => `${challenge.value?.unofficialLabel}, semaine ${publication.value?.week}.`),
})
</script>
