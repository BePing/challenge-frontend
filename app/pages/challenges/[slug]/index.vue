<template>
  <div v-if="challenge" class="space-y-8 sm:space-y-12">
    <div class="text-center space-y-4 sm:space-y-6 py-6 sm:py-8">
      <Trophy class="h-12 w-12 text-primary mx-auto" />
      <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold">{{ challenge.name }}</h1>
      <Badge variant="secondary">{{ challenge.unofficialLabel }}</Badge>
      <p v-if="challenge.description" class="text-muted-foreground max-w-2xl mx-auto">
        {{ challenge.description }}
      </p>
      <Badge v-if="publication" variant="outline">Semaine {{ publication.week }}</Badge>
      <div v-else class="rounded-lg border bg-muted/30 p-4 max-w-xl mx-auto">
        <p class="font-medium">Première publication à venir</p>
        <p v-if="challenge.nextPublicationAt" class="text-sm text-muted-foreground mt-1">
          Prochaine publication jeudi {{ formatDate(challenge.nextPublicationAt) }}.
        </p>
      </div>
    </div>

    <div v-if="publication">
      <h2 class="text-xl sm:text-2xl font-bold mb-6 text-center">Sélectionnez une région</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
        <NuxtLink
          v-for="region in challenge.regions"
          :key="region.code"
          :to="`/challenges/${challenge.slug}/region/${region.code.toLowerCase().replace(/_/g, '-')}`"
          class="group block p-5 sm:p-6 rounded-lg border-2 hover:border-primary/50 hover:shadow-lg transition-all bg-card min-h-[120px]"
        >
          <h3 class="text-lg sm:text-xl font-semibold group-hover:text-primary">{{ region.label }}</h3>
          <span class="inline-flex items-center text-primary text-sm mt-4">Voir les classements <ArrowRight class="h-4 w-4 ml-1" /></span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Trophy } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const { challenge, publication, selectChallenge } = useChallengeContext()
await selectChallenge(String(route.params.slug))
if (!challenge.value) throw createError({ statusCode: 404, statusMessage: 'Challenge introuvable' })

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-BE', { dateStyle: 'long' }).format(new Date(value))

useSeoMeta({
  title: computed(() => challenge.value?.name ?? 'Challenge'),
  description: computed(() => challenge.value?.description ?? challenge.value?.unofficialLabel),
})
</script>
