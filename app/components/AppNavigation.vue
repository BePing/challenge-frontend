<template>
  <header class="sticky top-0 z-40 border-b border-pulse-line bg-pulse-surface/95 backdrop-blur">
    <div class="mx-auto flex min-h-16 max-w-[1280px] items-center gap-4 px-4 sm:gap-7 sm:px-7">
      <NuxtLink
        :to="challenge ? challengePath(challenge.slug) : '/'"
        class="flex min-w-0 items-center gap-2 text-pulse-ink"
      >
        <BepingMark :size="24" />
        <span class="truncate font-display text-lg font-extrabold tracking-[-0.6px] sm:text-xl">
          {{ challenge?.shortName || challenge?.name || 'Challenges' }}
        </span>
        <span class="hidden rounded-md bg-pulse-bg px-[7px] py-[3px] font-mono text-[10px] font-bold text-pulse-ink2 lg:inline">
          par BePing
        </span>
      </NuxtLink>

      <nav aria-label="Régions" class="hidden self-stretch md:flex">
        <NuxtLink
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          :aria-current="item.active ? 'page' : undefined"
          :class="[
            'relative flex items-center px-3 text-[13.5px] transition-colors',
            item.active ? 'font-extrabold text-pulse-ink' : 'font-semibold text-pulse-ink2 hover:text-pulse-ink',
          ]"
        >
          {{ item.label }}
          <span v-if="item.active" class="absolute inset-x-3 bottom-0 h-[3px] rounded-sm bg-pulse-blue" />
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <span
          v-if="publication"
          class="rounded-full bg-pulse-ink px-3 py-2 font-mono text-xs font-extrabold text-white sm:px-3.5"
        >
          <span class="sm:hidden">S{{ publication.week }}</span>
          <span class="hidden sm:inline">Semaine {{ publication.week }}</span>
        </span>

        <Sheet>
          <SheetTrigger as-child>
            <button
              type="button"
              aria-label="Ouvrir la navigation"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-pulse-bg text-pulse-ink md:hidden"
            >
              <Menu class="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent class="bg-pulse-bg">
            <SheetHeader>
              <SheetTitle class="font-display text-xl font-extrabold tracking-tight">Navigation</SheetTitle>
            </SheetHeader>
            <nav aria-label="Régions" class="mt-6 flex flex-col gap-1">
              <SheetClose v-for="item in links" :key="item.to" as-child>
                <NuxtLink
                  :to="item.to"
                  :aria-current="item.active ? 'page' : undefined"
                  :class="[
                    'rounded-xl px-4 py-3 text-base',
                    item.active ? 'bg-pulse-ink font-bold text-white' : 'font-semibold text-pulse-ink hover:bg-pulse-surface',
                  ]"
                >
                  {{ item.label }}
                </NuxtLink>
              </SheetClose>
              <NuxtLink
                v-if="challenges.length > 1"
                to="/"
                class="mt-2 rounded-xl px-4 py-3 text-sm font-semibold text-pulse-blue"
              >
                Changer de challenge
              </NuxtLink>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const route = useRoute()
const { challenge, challenges, publication } = useChallengeContext()

const links = computed(() => {
  if (!challenge.value) return []
  const slug = challenge.value.slug
  const home = challengePath(slug)
  return [
    { label: 'Accueil', to: home, active: route.path === home },
    ...challenge.value.regions.map((region) => {
      const to = regionPath(slug, region.code)
      return { label: region.label, to, active: route.path === to }
    }),
  ]
})
</script>
