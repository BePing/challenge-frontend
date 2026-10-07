<template>
  <div class="flex flex-col gap-[22px]">
    <section class="relative overflow-hidden rounded-[22px] bg-pulse-ink px-6 py-8 text-white sm:px-10 sm:py-12">
      <div
        class="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full opacity-60"
        style="background: radial-gradient(circle, #2F4DFF 0%, rgba(47, 77, 255, 0) 70%)"
      />
      <div class="relative max-w-2xl">
        <div class="text-[10.5px] font-extrabold uppercase tracking-[1.2px] text-white/70">BePing</div>
        <h1 class="mt-3 font-display text-4xl font-extrabold leading-none tracking-[-1.6px] sm:text-[56px] sm:tracking-[-2.4px]">
          Challenges communautaires
        </h1>
        <p class="mt-4 font-display text-lg font-semibold leading-[1.35] text-white/85">
          Des classements suivis par leurs participants, indépendants des compétitions officielles.
        </p>
      </div>
    </section>

    <div v-if="pending" class="grid gap-3 md:grid-cols-2">
      <div v-for="index in 2" :key="index" class="h-36 animate-pulse rounded-[18px] bg-pulse-surface" />
    </div>
    <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <NuxtLink
        v-for="item in challenges"
        :key="item.slug"
        :to="challengePath(item.slug)"
        class="group block rounded-[18px] bg-pulse-surface px-5 py-[18px] transition-transform hover:-translate-y-0.5"
      >
        <span class="text-[10.5px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">{{ item.unofficialLabel }}</span>
        <h2 class="mt-2 font-display text-[22px] font-extrabold tracking-[-0.6px] group-hover:text-pulse-blue">{{ item.name }}</h2>
        <p v-if="item.description" class="mt-2 text-sm text-pulse-ink2">{{ item.description }}</p>
        <p v-if="item.nextPublicationAt" class="mt-4 font-mono text-xs font-bold text-pulse-blue">
          Prochaine publication le {{ formatDate(item.nextPublicationAt) }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  new Intl.DateTimeFormat('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value))

useSeoMeta({
  title: 'Challenges communautaires de tennis de table',
  description: 'Consultez les classements communautaires et non officiels publiés par Beping.',
})
</script>
