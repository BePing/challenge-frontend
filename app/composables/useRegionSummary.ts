import type { RegionSummary } from '~/types/challenge-view'

export const useRegionSummary = () => {
  const api = useChallengeApi()
  const { currentSlug } = useChallengeContext()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const getRegionSummary = async (
    region: string,
    _weekName: number,
  ): Promise<RegionSummary | null> => {
    if (!currentSlug.value) return null
    loading.value = true
    try {
      const summary = await api.regionSummary(currentSlug.value, region)
      if (!summary) return null
      return {
        region: summary.regionCode,
        totalPlayers: summary.totalPlayers,
        playersByLevel: summary.playersByLevel,
        topPlayersByLevel: {},
        clubs: summary.clubs,
        lastUpdated: new Date(summary.publishedAt),
        aiSummary: summary.aiSummary as RegionSummary['aiSummary'],
      }
    } catch (cause) {
      error.value = cause as Error
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    getRegionSummary,
    subscribeToRegionSummary: () => null,
  }
}
