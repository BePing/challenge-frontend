import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter, 
  type QueryDocumentSnapshot,
  type DocumentData
} from 'firebase/firestore'
import type { RankingDocument } from '~/types/firestore'

/**
 * Composable for querying player rankings with pagination
 */
export const useRankings = () => {
  const { firestore } = useFirebase()
  
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const lastDoc = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
  
  /**
   * Get player rankings for a specific region, level, and week
   * @param region - Region code
   * @param level - Level name
   * @param weekName - Week number
   * @param pageSize - Number of players per page (default: 12)
   * @param startAfterDoc - Document to start after for pagination
   */
  const getRankings = async (
    region: string,
    level: string,
    weekName: number,
    pageSize: number = 12,
    startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<RankingDocument[]> => {
    if (!firestore) {
      return []
    }
    
    loading.value = true
    error.value = null
    
    try {
      const rankingsRef = collection(firestore, 'rankings')
      
      let q = query(
        rankingsRef,
        where('region', '==', region),
        where('level', '==', level),
        where('weekName', '==', weekName),
        orderBy('position', 'asc'),
        limit(pageSize)
      )
      
      // Add pagination if starting after a document
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc))
      }
      
      const querySnapshot = await getDocs(q)
      
      // Update last document for pagination
      if (!querySnapshot.empty) {
        lastDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1]
      } else {
        lastDoc.value = null
      }
      
      return querySnapshot.docs.map(doc => transformRankingDocument(doc))
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching rankings:', err)
      
      // Check if it's a missing index error
      if (err instanceof Error && err.message.includes('index')) {
        console.warn('Firestore index may be missing. Check Firebase console for index creation link.')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get all rankings without pagination limit (for searching)
   */
  const getAllRankings = async (
    region: string,
    level: string,
    weekName: number
  ): Promise<RankingDocument[]> => {
    if (!firestore) {
      return []
    }
    
    const allRankings: RankingDocument[] = []
    let querySnapshot
    let lastDocSnapshot = null
    
    try {
      const rankingsRef = collection(firestore, 'rankings')
      const batchSize = 500 // Firestore limit
      
      do {
        let q = query(
          rankingsRef,
          where('region', '==', region),
          where('level', '==', level),
          where('weekName', '==', weekName),
          orderBy('position', 'asc'),
          limit(batchSize)
        )
        
        if (lastDocSnapshot) {
          q = query(q, startAfter(lastDocSnapshot))
        }
        
        querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const batchResults = querySnapshot.docs.map(doc => transformRankingDocument(doc))
          allRankings.push(...batchResults)
          lastDocSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1]
        }
      } while (querySnapshot && querySnapshot.size === batchSize)
      
      return allRankings
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching all rankings:', err)
      
      if (err instanceof Error && err.message.includes('index')) {
        console.warn('Firestore index may be missing. Check Firebase console for index creation link.')
      }
      
      throw err
    }
  }
  
  /**
   * Get next page of rankings
   */
  const getNextPage = async (
    region: string,
    level: string,
    weekName: number,
    pageSize: number = 12
  ): Promise<RankingDocument[]> => {
    return getRankings(region, level, weekName, pageSize, lastDoc.value)
  }
  
  /**
   * Reset pagination state
   */
  const resetPagination = () => {
    lastDoc.value = null
  }
  
  /**
   * Transform Firestore document to RankingDocument type
   */
  const transformRankingDocument = (doc: QueryDocumentSnapshot<DocumentData>): RankingDocument => {
    const data = doc.data()
    return {
      uniqueIndex: data.uniqueIndex,
      name: data.name,
      clubIndex: data.clubIndex,
      clubName: data.clubName,
      region: data.region,
      level: data.level,
      position: data.position,
      points: {
        total: data.points?.total || 0,
        breakdown: data.points?.breakdown || {
          count5Pts: 0,
          count3Pts: 0,
          count2Pts: 0,
          count1Pts: 0,
          count0Pts: 0,
        },
      },
      weekName: data.weekName,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getRankings,
    getAllRankings,
    getNextPage,
    resetPagination,
    hasMore: computed(() => lastDoc.value !== null)
  }
}

