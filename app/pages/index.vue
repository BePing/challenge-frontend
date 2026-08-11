<template>
  <div class="space-y-8 sm:space-y-12">
    <div class="text-center space-y-4 py-6 sm:py-8">
      <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10">
        <Trophy class="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
        Challenges communautaires
      </h1>
      <p class="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
        Des classements suivis par leurs participants, indépendants des compétitions officielles.
      </p>
    </div>

    <div v-if="pending" class="grid gap-4 max-w-4xl mx-auto">
      <Skeleton v-for="index in 3" :key="index" class="h-36" />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
      <NuxtLink
        v-for="item in challenges"
        :key="item.slug"
        :to="challengePath(item.slug)"
        class="group block p-5 sm:p-6 rounded-lg border-2 hover:border-primary/50 hover:shadow-lg transition-all bg-card"
      >
        <Badge variant="secondary" class="mb-3">{{ item.unofficialLabel }}</Badge>
        <h2 class="text-xl font-semibold group-hover:text-primary">{{ item.name }}</h2>
        <p v-if="item.description" class="mt-2 text-sm text-muted-foreground">{{ item.description }}</p>
        <p v-if="item.nextPublicationAt" class="mt-4 text-sm font-medium text-primary">
          Prochaine publication jeudi {{ formatDate(item.nextPublicationAt) }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const { challenges, loadChallenges } = useChallengeContext()
const pending = ref(true)

try {
  const items = await loadChallenges()
  const target = singleChallengePath(items)
  if (target) {
    await navigateTo(target, { replace: true })
  }
} finally {
  pending.value = false
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-BE', { dateStyle: 'long' }).format(new Date(value))

useSeoMeta({
  title: 'Challenges communautaires de tennis de table',
  description: 'Consultez les classements communautaires et non officiels publiés par Beping.',
})
</script>
