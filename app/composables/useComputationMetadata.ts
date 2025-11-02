import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import type { ComputationMetadata } from '~/types/firestore'

/**
 * Composable for querying computation metadata
 * Used to get current week and validate data availability
 */
export const useComputationMetadata = () => {
  const { firestore } = useFirebase()
  
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  /**
   * Get metadata for a specific week
   * @param weekName - Week number to query
   */
  const getMetadataByWeek = async (weekName: number): Promise<ComputationMetadata | null> => {
    if (!firestore) {
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(firestore, 'computation-metadata', `week-${weekName}`)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          timestamp: data.timestamp.toDate(),
          weekName: data.weekName,
          version: data.version,
          totalPlayersProcessed: data.totalPlayersProcessed,
          regionsProcessed: data.regionsProcessed || [],
          levelsProcessed: data.levelsProcessed || [],
        } as ComputationMetadata
      }
      
      return null
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching computation metadata:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get the latest metadata (most recent week)
   * Requires index on timestamp field
   */
  const getLatestMetadata = async (): Promise<ComputationMetadata | null> => {
    if (!firestore) {
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const metadataRef = collection(firestore, 'computation-metadata')
      const q = query(metadataRef, orderBy('timestamp', 'desc'), limit(1))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty && querySnapshot.docs[0]) {
        const docSnap = querySnapshot.docs[0]
        const data = docSnap.data()
        return {
          timestamp: data.timestamp.toDate(),
          weekName: data.weekName,
          version: data.version,
          totalPlayersProcessed: data.totalPlayersProcessed,
          regionsProcessed: data.regionsProcessed || [],
          levelsProcessed: data.levelsProcessed || [],
        } as ComputationMetadata
      }
      
      return null
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching latest computation metadata:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getMetadataByWeek,
    getLatestMetadata
  }
}

