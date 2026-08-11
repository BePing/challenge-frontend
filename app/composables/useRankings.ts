import type { ChallengeRanking } from '~/types/challenge'
import type { RankingDocument } from '~/types/challenge-view'

export const useRankings = () => {
  const api = useChallengeApi()
  const { currentSlug } = useChallengeContext()
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const nextCursor = ref<string | null>(null)

  const transform = (ranking: ChallengeRanking): RankingDocument => ({
    uniqueIndex: ranking.playerUniqueIndex,
    name: ranking.playerName,
    clubIndex: ranking.clubIndex,
    clubName: ranking.clubName,
    region: ranking.regionCode,
    level: ranking.levelCode,
    position: ranking.position,
    points: { total: ranking.points, breakdown: ranking.breakdown },
    weekName: ranking.week,
    lastUpdated: new Date(ranking.publishedAt),
  })

  const getRankings = async (
    region: string,
    level: string,
    weekName: number,
    pageSize = 50,
    cursor?: string | null,
    search?: string,
  ): Promise<RankingDocument[]> => {
    if (!currentSlug.value) return []
    loading.value = true
    error.value = null
    try {
      const page = await api.rankings(currentSlug.value, {
        region,
        level,
        week: weekName,
        limit: pageSize,
        cursor: cursor || undefined,
        search: search || undefined,
      })
      nextCursor.value = page.nextCursor ?? null
      return page.items.map(transform)
    } catch (cause) {
      error.value = cause as Error
      throw cause
    } finally {
      loading.value = false
    }
  }

  const getAllRankings = (
    region: string,
    level: string,
    weekName: number,
    search?: string,
  ) => getRankings(region, level, weekName, 100, null, search)

  const getNextPage = (
    region: string,
    level: string,
    weekName: number,
    pageSize = 50,
  ) => getRankings(region, level, weekName, pageSize, nextCursor.value)

  return {
    loading: readonly(loading),
    error: readonly(error),
    getRankings,
    getAllRankings,
    getNextPage,
    resetPagination: () => (nextCursor.value = null),
    hasMore: computed(() => nextCursor.value !== null),
  }
}
