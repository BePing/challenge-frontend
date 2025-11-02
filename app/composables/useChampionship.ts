export const useChampionship = () => {
  const currentWeek = ref(12)
  const selectedRegion = ref('')
  const selectedLevel = ref('')
  
  // Initialize current week from Firebase (only on client side)
  if (import.meta.client) {
    const { getLatestMetadata } = useComputationMetadata()
    
    onMounted(async () => {
      try {
        console.log('useChampionship: Fetching latest metadata for current week')
        const metadata = await getLatestMetadata()
        console.log('useChampionship: Metadata received:', metadata)
        if (metadata) {
          currentWeek.value = metadata.weekName
          console.log('useChampionship: Current week updated to:', currentWeek.value)
        }
      } catch (error) {
        console.error('Failed to load current week:', error)
      }
    })
  }
  
  // Watch for changes to currentWeek
  watch(currentWeek, (newValue, oldValue) => {
    console.log('useChampionship: currentWeek changed from', oldValue, 'to', newValue)
  })
  
  const regions = [
    { code: 'LIEGE', name: 'Liège', playerCount: 0 },
    { code: 'HUY_WAREMME', name: 'Huy-Waremme', playerCount: 0 },
    { code: 'VERVIERS', name: 'Verviers', playerCount: 0 }
  ]
  
  const levels = [
    { code: 'NAT_WB', name: 'National WB', playerCount: 0, color: 'red' },
    { code: 'P1', name: 'Provincial 1', playerCount: 0, color: 'orange' },
    { code: 'P2', name: 'Provincial 2', playerCount: 0, color: 'yellow' },
    { code: 'P3', name: 'Provincial 3', playerCount: 0, color: 'green' },
    { code: 'P4', name: 'Provincial 4', playerCount: 0, color: 'blue' },
    { code: 'P5', name: 'Provincial 5', playerCount: 0, color: 'indigo' },
    { code: 'P6', name: 'Provincial 6', playerCount: 0, color: 'purple' }
  ]
  
  const getCurrentRegionName = () => {
    const regionNames = {
      'LIEGE': 'Liège',
      'VERVIERS': 'Verviers',
      'HUY_WAREMME': 'Huy-Waremme'
    }
    return regionNames[selectedRegion.value as keyof typeof regionNames] || selectedRegion.value
  }
  
  const getCurrentLevelInfo = () => {
    return levels.find(level => level.code === selectedLevel.value)
  }
  
  return {
    currentWeek,
    selectedRegion,
    selectedLevel,
    regions,
    levels,
    getCurrentRegionName,
    getCurrentLevelInfo
  }
}