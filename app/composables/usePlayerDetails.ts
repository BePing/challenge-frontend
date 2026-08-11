import type { PlayerPointsDetails } from '~/types/challenge-view'

export const usePlayerDetails = () => {
  const api = useChallengeApi()
  const { currentSlug } = useChallengeContext()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const getPlayerDetails = async (
    uniqueIndex: string,
  ): Promise<PlayerPointsDetails | null> => {
    if (!currentSlug.value) return null
    loading.value = true
    try {
      const response = await api.player(currentSlug.value, uniqueIndex)
      const latest = response.rankings[0]
      if (!latest) return null
      return {
        name: latest.playerName,
        club: latest.clubName,
        points: response.points.map((point) => ({
          divisionId: point.divisionId,
          weekName: point.week,
          level: point.levelCode,
          victoryCount: point.victoryCount,
          forfeit: point.forfeit,
          pointsWon: point.pointsWon,
          matchId: point.matchId,
          matchUniqueId: point.matchUniqueId,
        })),
        levelAttributed: latest.levelLabel,
        history: response.rankings.map((ranking) => ({
          points: ranking.points,
          level: ranking.levelLabel,
          position: ranking.position,
          weekName: ranking.week,
        })),
        lastUpdated: new Date(latest.publishedAt),
        weekName: latest.week,
      }
    } catch (cause) {
      error.value = cause as Error
      throw cause
    } finally {
      loading.value = false
    }
  }

  return { loading: readonly(loading), error: readonly(error), getPlayerDetails }
}
