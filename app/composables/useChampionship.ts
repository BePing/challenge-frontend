export const useChampionship = () => {
  const { challenge, publication } = useChallengeContext()
  const selectedRegion = useState('selected-challenge-region', () => '')
  const selectedLevel = useState('selected-challenge-level', () => '')
  const currentWeek = computed(() => publication.value?.week ?? 0)
  const regions = computed(() =>
    (challenge.value?.regions ?? []).map((region) => ({
      code: region.code,
      name: region.label,
      playerCount: 0,
    })),
  )
  const levels = computed(() =>
    (challenge.value?.levels ?? []).map((level) => ({
      code: level.code,
      name: level.label,
      playerCount: 0,
      color: 'primary',
    })),
  )

  return {
    currentWeek,
    selectedRegion,
    selectedLevel,
    regions,
    levels,
    getCurrentRegionName: () =>
      regions.value.find((region) => region.code === selectedRegion.value)?.name ??
      selectedRegion.value,
    getCurrentLevelInfo: () =>
      levels.value.find((level) => level.code === selectedLevel.value),
  }
}
