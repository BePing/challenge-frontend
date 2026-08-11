<template>
  <div v-if="challenge && publication" class="space-y-5 sm:space-y-6 md:space-y-8">
    <div class="flex flex-col gap-2">
      <Badge variant="secondary" class="w-fit">{{ challenge.unofficialLabel }}</Badge>
      <h1 class="text-xl sm:text-2xl md:text-4xl font-bold">
        {{ challenge.name }} — {{ regionName }}
      </h1>
      <p class="text-sm text-muted-foreground">Semaine {{ publication.week }}</p>
    </div>
    <RegionSummary :region="regionCode" :week="publication.week" />
    <PlayerRankings
      :region="regionCode"
      :level="selectedLevel"
      :week="publication.week"
      @update:level="selectedLevel = $event"
    />
    <PlayerDetailModal v-model:open="showPlayerModal" :player="selectedPlayer" />
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

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
const selectedLevel = ref(challenge.value.levels[0]?.code ?? '')
const showPlayerModal = ref(false)
const selectedPlayer = ref<unknown>(null)
provide('openPlayerModal', (player: unknown) => {
  selectedPlayer.value = player
  showPlayerModal.value = true
})

useSeoMeta({
  title: computed(() => `${challenge.value?.name} — ${regionName.value}`),
  description: computed(() => `${challenge.value?.unofficialLabel}, semaine ${publication.value?.week}.`),
})
</script>
