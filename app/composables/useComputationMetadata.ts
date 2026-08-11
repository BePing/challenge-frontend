import type { ComputationMetadata } from '~/types/challenge-view'

export const useComputationMetadata = () => {
  const { challenge, publication } = useChallengeContext()
  const metadata = (): ComputationMetadata | null =>
    publication.value
      ? {
          timestamp: new Date(publication.value.publishedAt),
          weekName: publication.value.week,
          version: publication.value.checksum,
          totalPlayersProcessed: publication.value.totalPlayers,
          regionsProcessed: challenge.value?.regions.map((region) => region.code) ?? [],
          levelsProcessed: challenge.value?.levels.map((level) => level.code) ?? [],
        }
      : null
  return {
    loading: readonly(ref(false)),
    error: readonly(ref<Error | null>(null)),
    getMetadataByWeek: async (week: number) =>
      publication.value?.week === week ? metadata() : null,
    getLatestMetadata: async () => metadata(),
  }
}
