import type {
  ChallengePlayerResponse,
  ChallengePublication,
  ChallengeRankingPage,
  ChallengeRegionSummary,
  ChallengeSummary,
} from '~/types/challenge'

export const useChallengeApi = () => {
  const config = useRuntimeConfig()
  const baseURL = String(config.public.bepingApiBaseUrl).replace(/\/$/, '')

  const request = <T>(path: string, query?: Record<string, unknown>) =>
    $fetch<T>(`${baseURL}${path}`, { query })

  return {
    listChallenges: () => request<ChallengeSummary[]>('/v1/challenges'),
    latestPublication: (slug: string) =>
      request<ChallengePublication | null>(
        `/v1/challenges/${encodeURIComponent(slug)}/publications/latest`,
      ),
    rankings: (
      slug: string,
      query: Record<string, string | number | undefined>,
    ) =>
      request<ChallengeRankingPage>(
        `/v1/challenges/${encodeURIComponent(slug)}/rankings`,
        query,
      ),
    regionSummary: (slug: string, region: string) =>
      request<ChallengeRegionSummary | null>(
        `/v1/challenges/${encodeURIComponent(slug)}/regions/${encodeURIComponent(region)}/summary`,
      ),
    player: (slug: string, uniqueIndex: string | number) =>
      request<ChallengePlayerResponse>(
        `/v1/challenges/${encodeURIComponent(slug)}/players/${uniqueIndex}`,
      ),
  }
}
