<template>
  <div v-if="challenge" class="flex flex-col gap-[22px]">
    <section class="relative overflow-hidden rounded-[22px] bg-pulse-ink px-6 py-8 text-white sm:px-10 sm:py-12">
      <div
        class="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full opacity-60"
        style="background: radial-gradient(circle, #2F4DFF 0%, rgba(47, 77, 255, 0) 70%)"
      />
      <div class="relative max-w-2xl">
        <div class="text-[10.5px] font-extrabold uppercase tracking-[1.2px] text-white/70">{{ challenge.unofficialLabel }}</div>
        <h1 class="mt-3 font-display text-4xl font-extrabold leading-none tracking-[-1.6px] sm:text-[56px] sm:tracking-[-2.4px]">
          {{ challenge.name }}
        </h1>
        <p v-if="challenge.description" class="mt-4 font-display text-lg font-semibold leading-[1.35] text-white/85">
          {{ challenge.description }}
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <span v-if="publication" class="rounded-full bg-pulse-ball px-3.5 py-2 font-mono text-xs font-extrabold text-pulse-ink">
            Semaine {{ publication.week }}
          </span>
          <span v-if="challenge.nextPublicationAt" class="rounded-full bg-white/[0.12] px-3.5 py-2 font-mono text-xs font-bold text-white/80">
            Prochaine publication le {{ formatDate(challenge.nextPublicationAt) }}
          </span>
        </div>
      </div>
    </section>

    <section v-if="publication" aria-labelledby="regions-title">
      <h2 id="regions-title" class="mb-3.5 font-display text-2xl font-extrabold tracking-[-0.8px]">Choisissez une région</h2>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <NuxtLink
          v-for="region in challenge.regions"
          :key="region.code"
          :to="regionPath(challenge.slug, region.code)"
          class="group flex min-h-[120px] flex-col justify-between rounded-[18px] bg-pulse-surface px-5 py-[18px] transition-transform hover:-translate-y-0.5"
        >
          <span class="font-display text-[22px] font-extrabold tracking-[-0.6px]">{{ region.label }}</span>
          <span class="mt-4 inline-flex items-center gap-1 text-[13px] font-extrabold text-pulse-blue">
            Voir le classement
            <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </NuxtLink>
      </div>
    </section>
    <section v-else class="rounded-[18px] bg-pulse-surface px-5 py-6">
      <p class="font-display text-lg font-extrabold">Première publication à venir</p>
      <p v-if="challenge.nextPublicationAt" class="mt-1 text-sm text-pulse-ink2">
        Les classements seront publiés le {{ formatDate(challenge.nextPublicationAt) }}.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const route = useRoute()
const { challenge, publication, selectChallenge } = useChallengeContext()
await selectChallenge(String(route.params.slug))
if (!challenge.value) throw createError({ statusCode: 404, statusMessage: 'Challenge introuvable' })

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value))

useSeoMeta({
  title: computed(() => challenge.value?.name ?? 'Challenge'),
  description: computed(() => challenge.value?.description ?? challenge.value?.unofficialLabel),
})
</script>
