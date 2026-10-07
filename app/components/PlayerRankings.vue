<template>
  <section aria-label="Classement" class="flex flex-wrap items-start gap-4">
    <div class="flex min-w-0 flex-[999_1_640px] flex-col gap-3.5">
      <div class="flex flex-wrap items-center justify-between gap-2.5">
        <h2 class="font-display text-2xl font-extrabold tracking-[-0.8px]">
          Classement
          <span v-if="currentLevel" class="text-sm font-semibold tracking-normal text-pulse-ink2">
            · {{ currentLevel.shortLabel }}<template v-if="currentLevel.count"> · {{ currentLevel.count }} joueurs</template>
          </span>
        </h2>
        <PlayerSearch v-model="searchQuery" :loading="searching" />
      </div>

      <div role="group" aria-label="Niveau" class="flex flex-wrap gap-1.5">
        <button
          v-for="option in levels"
          :key="option.code"
          type="button"
          :aria-pressed="option.code === level"
          :class="[
            'inline-flex min-h-9 items-center gap-[7px] rounded-full px-3.5 text-[12.5px] font-bold transition-colors',
            option.code === level ? 'bg-pulse-ink text-white' : 'bg-pulse-surface text-pulse-ink2 hover:text-pulse-ink',
          ]"
          @click="emit('update:level', option.code)"
        >
          {{ option.shortLabel }}
          <span v-if="option.count" class="tabular font-mono text-[10px] font-bold opacity-65">{{ option.count }}</span>
        </button>
      </div>

      <div v-if="podium.length === 3" class="hidden gap-3 sm:grid sm:grid-cols-3">
        <button
          v-for="player in podium"
          :key="player.uniqueIndex"
          type="button"
          :class="[
            'relative flex min-w-0 flex-col gap-2.5 overflow-hidden rounded-[18px] px-[18px] py-4 text-left transition-transform hover:-translate-y-0.5',
            player.position === 1 ? 'bg-pulse-ink text-white' : 'bg-pulse-surface text-pulse-ink',
          ]"
          @click="openPlayerDetails(player)"
        >
          <span class="flex w-full items-center justify-between">
            <span
              :class="[
                'rounded-full px-[9px] py-1 font-mono text-[11px] font-extrabold text-pulse-ink',
                player.position === 1 ? 'bg-pulse-ball' : 'bg-pulse-bg',
              ]"
            >#{{ player.position }}</span>
            <span :class="['font-mono text-[10.5px]', player.position === 1 ? 'text-white/[0.68]' : 'text-pulse-ink2']">
              {{ player.played }} matchs
            </span>
          </span>
          <span class="block w-full min-w-0">
            <span class="block truncate font-display text-[17px] font-extrabold tracking-[-0.4px]">{{ player.displayName }}</span>
            <span :class="['mt-0.5 block truncate text-xs', player.position === 1 ? 'text-white/[0.68]' : 'text-pulse-ink2']">
              {{ player.clubName }}
            </span>
          </span>
          <span class="flex items-baseline gap-1.5">
            <span class="tabular font-display text-[40px] font-extrabold leading-[0.9] tracking-[-1.6px]">{{ player.points.total }}</span>
            <span :class="['font-mono text-[11px] font-bold', player.position === 1 ? 'text-white/[0.68]' : 'text-pulse-ink2']">
              pts · {{ player.average }}/match
            </span>
          </span>
        </button>
      </div>

      <div class="overflow-hidden rounded-[18px] bg-pulse-surface">
        <!-- Desktop: table -->
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[620px] border-collapse text-left">
            <caption class="sr-only">Classement {{ currentLevel?.shortLabel }}</caption>
            <thead>
              <tr class="border-b border-pulse-line text-[10px] font-extrabold uppercase tracking-[1px] text-pulse-ink2">
                <th scope="col" class="w-[70px] py-3 pl-[18px] pr-2 font-extrabold">#</th>
                <th scope="col" class="px-2 py-3 font-extrabold">Joueur</th>
                <th scope="col" class="hidden px-2 py-3 font-extrabold xl:table-cell">Club</th>
                <th scope="col" class="w-[22%] px-2 py-3 font-extrabold">Répartition</th>
                <th scope="col" class="w-[68px] px-2 py-3 text-right font-extrabold">Matchs</th>
                <th scope="col" class="w-[64px] px-2 py-3 text-right font-extrabold">Pts</th>
                <th scope="col" class="w-[112px] py-3 pl-2 pr-[18px]"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody v-if="loading">
              <tr v-for="index in 8" :key="`skeleton-${index}`" class="border-b border-pulse-line last:border-0">
                <td class="py-3 pl-[18px] pr-2"><div class="h-[30px] w-[30px] animate-pulse rounded-[9px] bg-pulse-bg" /></td>
                <td class="px-2 py-3"><div class="h-4 w-40 animate-pulse rounded bg-pulse-bg" /></td>
                <td class="hidden px-2 py-3 xl:table-cell"><div class="h-4 w-28 animate-pulse rounded bg-pulse-bg" /></td>
                <td class="px-2 py-3"><div class="h-2 w-full animate-pulse rounded-full bg-pulse-bg" /></td>
                <td class="px-2 py-3"><div class="ml-auto h-4 w-6 animate-pulse rounded bg-pulse-bg" /></td>
                <td class="px-2 py-3"><div class="ml-auto h-5 w-8 animate-pulse rounded bg-pulse-bg" /></td>
                <td class="py-3 pl-2 pr-[18px]"><div class="ml-auto h-[34px] w-[86px] animate-pulse rounded-full bg-pulse-bg" /></td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="player in visiblePlayers"
                :id="`player-row-${player.uniqueIndex}`"
                :key="player.uniqueIndex"
                class="border-b border-pulse-line transition-colors last:border-0 hover:bg-pulse-bg/60"
              >
                <td class="py-2.5 pl-[18px] pr-2">
                  <span :class="['tabular flex h-[30px] w-[30px] items-center justify-center rounded-[9px] font-mono text-xs font-extrabold', rankClass(player.position)]">
                    {{ player.position }}
                  </span>
                </td>
                <td class="max-w-0 px-2 py-2.5">
                  <div class="flex min-w-0 items-center gap-2.5">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pulse-bg text-[11px] font-extrabold">
                      {{ player.initials }}
                    </span>
                    <div class="min-w-0">
                      <div class="truncate text-sm font-bold">{{ player.displayName }}</div>
                      <div class="mt-px truncate font-mono text-[10.5px] text-pulse-ink2">#{{ player.uniqueIndex }}<span class="font-sans xl:hidden"> · {{ player.clubName }}</span></div>
                    </div>
                  </div>
                </td>
                <td class="hidden max-w-0 truncate px-2 py-2.5 text-[13px] text-pulse-ink2 xl:table-cell">{{ player.clubName }}</td>
                <td class="px-2 py-2.5"><PointsBar :breakdown="player.points.breakdown" /></td>
                <td class="tabular px-2 py-2.5 text-right font-mono text-[12.5px] font-bold text-pulse-ink2">{{ player.played }}</td>
                <td class="tabular px-2 py-2.5 text-right font-display text-xl font-extrabold tracking-[-0.6px]">{{ player.points.total }}</td>
                <td class="py-2.5 pl-2 pr-[18px] text-right">
                  <button
                    type="button"
                    class="inline-flex min-h-[34px] items-center gap-[5px] rounded-full bg-pulse-blue-soft px-3 text-xs font-extrabold text-pulse-blue transition-colors hover:bg-pulse-blue hover:text-white"
                    :aria-label="`Détails de ${player.displayName}`"
                    @click="openPlayerDetails(player)"
                  >
                    Détails
                    <ChevronRight class="h-3 w-3" :stroke-width="2.8" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile: list -->
        <ul class="md:hidden">
          <template v-if="loading">
            <li v-for="index in 6" :key="`m-skeleton-${index}`" class="flex items-center gap-3 border-b border-pulse-line px-3.5 py-3 last:border-0">
              <div class="h-[30px] w-[30px] animate-pulse rounded-[9px] bg-pulse-bg" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-36 animate-pulse rounded bg-pulse-bg" />
                <div class="h-1.5 w-full animate-pulse rounded-full bg-pulse-bg" />
              </div>
            </li>
          </template>
          <li v-for="player in loading ? [] : visiblePlayers" :key="`m-${player.uniqueIndex}`" class="border-b border-pulse-line last:border-0">
            <button
              type="button"
              class="grid w-full grid-cols-[30px_minmax(0,1fr)_44px] items-center gap-3 px-3.5 py-[11px] text-left"
              :aria-label="`Détails de ${player.displayName}`"
              @click="openPlayerDetails(player)"
            >
              <span :class="['tabular flex h-[30px] w-[30px] items-center justify-center rounded-[9px] font-mono text-xs font-extrabold', rankClass(player.position)]">
                {{ player.position }}
              </span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-bold">{{ player.displayName }}</span>
                <span class="mt-px block truncate text-[11.5px] text-pulse-ink2">{{ player.clubName }} · {{ player.played }} matchs</span>
                <PointsBar class="mt-[7px]" :breakdown="player.points.breakdown" :show-counts="false" />
              </span>
              <span class="text-right">
                <span class="tabular block font-display text-[22px] font-extrabold leading-none tracking-[-0.7px]">{{ player.points.total }}</span>
                <span class="mt-0.5 block font-mono text-[9.5px] text-pulse-ink2">pts</span>
              </span>
            </button>
          </li>
        </ul>

        <p v-if="!loading && error" class="px-[18px] py-9 text-center text-[13px] text-pulse-loss-ink">
          Impossible de charger le classement. Réessayez dans un instant.
        </p>
        <p v-else-if="!loading && visiblePlayers.length === 0" class="px-[18px] py-9 text-center text-[13px] text-pulse-ink2">
          <template v-if="searchQuery">Aucun joueur ne correspond à « {{ searchQuery }} » dans ce niveau.</template>
          <template v-else>Aucun joueur classé dans ce niveau pour le moment.</template>
        </p>

        <div
          v-if="!loading && visiblePlayers.length > 0"
          class="flex flex-wrap items-center justify-between gap-2.5 border-t border-pulse-line px-3.5 py-3.5 sm:px-[18px]"
        >
          <span class="tabular font-mono text-[11px] text-pulse-ink2">
            {{ visiblePlayers.length }}<template v-if="currentLevel?.count && !searchQuery"> sur {{ currentLevel.count }}</template> joueurs
          </span>
          <button
            v-if="hasMore && !searchQuery"
            type="button"
            :disabled="loadingMore"
            class="inline-flex min-h-10 items-center gap-2 rounded-full bg-pulse-ink px-[18px] text-[13px] font-bold text-white transition-opacity disabled:opacity-60"
            @click="loadMorePlayers"
          >
            <Loader2 v-if="loadingMore" class="h-4 w-4 animate-spin" />
            Charger plus de joueurs
          </button>
        </div>
      </div>
    </div>

    <slot name="aside" />
  </section>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ChevronRight, Loader2 } from 'lucide-vue-next'
import type { RankingDocument } from '~/types/challenge-view'
import { averagePoints, displayName, initials, matchesPlayed } from '~/utils/challenge-stats'

export interface LevelOption {
  code: string
  shortLabel: string
  count?: number
}

type RankedPlayer = RankingDocument & {
  displayName: string
  initials: string
  played: number
  average: string
}

const props = defineProps<{
  region: string
  level: string
  week: number
  levels: LevelOption[]
}>()

const emit = defineEmits<{ 'update:level': [code: string] }>()

const openPlayerModal = inject<(player: RankingDocument) => void>('openPlayerModal')
const { getRankings, getNextPage, resetPagination, hasMore } = useRankings()
// Separate instance so a search never overwrites the main list's pagination cursor.
const { getRankings: searchRankings } = useRankings()

const players = ref<RankedPlayer[]>([])
const searchResults = ref<RankedPlayer[] | null>(null)
const searchQuery = ref('')
const loading = ref(true)
const loadingMore = ref(false)
const searching = ref(false)
const error = ref(false)

const decorate = (ranking: RankingDocument): RankedPlayer => {
  const played = matchesPlayed(ranking.points.breakdown)
  return {
    ...ranking,
    displayName: displayName(ranking.name),
    initials: initials(ranking.name),
    played,
    average: averagePoints(ranking.points.total, played),
  }
}

const currentLevel = computed(() => props.levels.find((option) => option.code === props.level))
const visiblePlayers = computed(() => searchResults.value ?? players.value)
const podium = computed(() =>
  searchResults.value ? [] : players.value.filter((player) => player.position <= 3).slice(0, 3),
)

const rankClass = (position: number) =>
  position === 1
    ? 'bg-pulse-ball text-pulse-ink'
    : position <= 3
      ? 'bg-pulse-ink text-white'
      : 'bg-pulse-bg text-pulse-ink2'

const openPlayerDetails = (player: RankingDocument) => openPlayerModal?.(player)

const loadRankings = async () => {
  if (!props.region || !props.level || !props.week) return
  loading.value = true
  error.value = false
  searchQuery.value = ''
  searchResults.value = null
  resetPagination()
  try {
    players.value = (await getRankings(props.region, props.level, props.week)).map(decorate)
  } catch {
    players.value = []
    error.value = true
  } finally {
    loading.value = false
  }
}

const loadMorePlayers = async () => {
  loadingMore.value = true
  try {
    const next = await getNextPage(props.region, props.level, props.week)
    players.value = [...players.value, ...next.map(decorate)]
  } catch {
    error.value = true
  } finally {
    loadingMore.value = false
  }
}

watchDebounced(
  searchQuery,
  async (query) => {
    const term = query.trim()
    if (!term) {
      searchResults.value = null
      return
    }
    searching.value = true
    try {
      // Search the whole level server-side rather than only the loaded page.
      const results = await searchRankings(props.region, props.level, props.week, 100, null, term)
      if (searchQuery.value.trim() === term) searchResults.value = results.map(decorate)
    } catch {
      searchResults.value = []
    } finally {
      searching.value = false
    }
  },
  { debounce: 250 },
)

watch(() => [props.region, props.level, props.week], loadRankings, { immediate: true })
</script>
