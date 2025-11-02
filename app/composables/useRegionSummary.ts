import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import type { RegionSummary, AISummary } from '~/types/firestore'

/**
 * Composable for querying region summaries with AI insights
 */
export const useRegionSummary = () => {
  const { firestore } = useFirebase()
  
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  /**
   * Get region summary for a specific region and week
   * @param region - Region code (e.g., 'LIEGE')
   * @param weekName - Week number
   */
  const getRegionSummary = async (region: string, weekName: number): Promise<RegionSummary | null> => {
    if (!firestore) {
      console.log('useRegionSummary: Firestore not initialized')
      return null
    }
    
    loading.value = true
    error.value = null
    
    const docId = `${region}-week-${weekName}`
    console.log('useRegionSummary: Fetching document:', docId)
    
    try {
      const docRef = doc(firestore, 'region-summaries', docId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        console.log('useRegionSummary: Document exists, raw data:', data)
        const transformed = transformRegionSummary(data)
        console.log('useRegionSummary: Transformed data:', transformed)
        return transformed
      }
      
      console.log('useRegionSummary: Document does not exist:', docId)
      return null
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching region summary:', err)
      // Don't throw - return null to allow UI to handle gracefully
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Subscribe to real-time updates for region summary
   * @param region - Region code
   * @param weekName - Week number
   * @param callback - Callback function called when data changes
   * @returns Unsubscribe function
   */
  const subscribeToRegionSummary = (
    region: string,
    weekName: number,
    callback: (summary: RegionSummary | null) => void
  ): Unsubscribe | null => {
    if (!firestore) {
      callback(null)
      return null
    }
    
    const docRef = doc(firestore, 'region-summaries', `${region}-week-${weekName}`)
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          callback(transformRegionSummary(data))
        } else {
          callback(null)
        }
      },
      (err) => {
        error.value = err
        console.error('Error in region summary subscription:', err)
        callback(null)
      }
    )
  }
  
  /**
   * Transform Firestore document to RegionSummary type
   */
  const transformRegionSummary = (data: any): RegionSummary => {
    return {
      region: data.region,
      totalPlayers: data.totalPlayers || 0,
      playersByLevel: data.playersByLevel || {},
      topPlayersByLevel: data.topPlayersByLevel || {},
      clubs: data.clubs || [],
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
      aiSummary: data.aiSummary ? transformAISummary(data.aiSummary) : undefined,
    }
  }
  
  /**
   * Transform AI summary data
   */
  const transformAISummary = (data: any): AISummary => {
    return {
      region: data.region,
      weekName: data.weekName,
      summary: data.summary,
      keyHighlights: data.keyHighlights || [],
      topPerformers: data.topPerformers || [],
      trends: {
        risingPlayers: data.trends?.risingPlayers || [],
        dominantClubs: data.trends?.dominantClubs || [],
        competitiveLevel: data.trends?.competitiveLevel || 'Modéré',
        weeklyInsight: data.trends?.weeklyInsight || '',
      },
      generatedAt: data.generatedAt?.toDate() || new Date(),
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getRegionSummary,
    subscribeToRegionSummary
  }
}

