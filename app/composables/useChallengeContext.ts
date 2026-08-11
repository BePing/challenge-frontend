import type { ChallengePublication, ChallengeSummary } from '~/types/challenge'

export const useChallengeContext = () => {
  const challenges = useState<ChallengeSummary[]>('challenges', () => [])
  const challenge = useState<ChallengeSummary | null>('challenge', () => null)
  const publication = useState<ChallengePublication | null>(
    'challenge-publication',
    () => null,
  )
  const loading = useState('challenge-loading', () => false)
  const api = useChallengeApi()

  const loadChallenges = async () => {
    if (challenges.value.length === 0) {
      challenges.value = await api.listChallenges()
    }
    return challenges.value
  }

  const selectChallenge = async (slug: string) => {
    loading.value = true
    try {
      await loadChallenges()
      challenge.value =
        challenges.value.find((entry) => entry.slug === slug) ?? null
      publication.value = challenge.value
        ? await api.latestPublication(slug).catch(() => null)
        : null
      return challenge.value
    } finally {
      loading.value = false
    }
  }

  const currentSlug = computed(() => {
    const routeSlug = useRoute().params.slug
    return String(routeSlug || challenge.value?.slug || '')
  })

  return {
    challenges,
    challenge,
    publication,
    loading: readonly(loading),
    currentSlug,
    loadChallenges,
    selectChallenge,
  }
}
