import { doc, getDoc } from 'firebase/firestore'
import type { PlayerPointsDetails, PlayerPoint, PlayerPointsHistory } from '~/types/firestore'

/**
 * Composable for querying detailed player statistics
 */
export const usePlayerDetails = () => {
  const { firestore } = useFirebase()
  
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  /**
   * Get detailed player statistics by unique index
   * @param uniqueIndex - Player's unique identifier
   */
  const getPlayerDetails = async (uniqueIndex: string): Promise<PlayerPointsDetails | null> => {
    if (!firestore) {
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const playerRef = doc(firestore, 'players-points-details', uniqueIndex)
      const playerDoc = await getDoc(playerRef)
      
      if (playerDoc.exists()) {
        const data = playerDoc.data()
        return transformPlayerDetails(data)
      }
      
      return null
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching player details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Transform Firestore document to PlayerPointsDetails type
   */
  const transformPlayerDetails = (data: any): PlayerPointsDetails => {
    // Sort points by weekName descending (most recent first)
    const sortedPoints = (data.points || []).sort((a: PlayerPoint, b: PlayerPoint) => 
      b.weekName - a.weekName
    )
    
    // Sort history by weekName descending
    const sortedHistory = (data.history || []).sort((a: PlayerPointsHistory, b: PlayerPointsHistory) => 
      b.weekName - a.weekName
    )
    
    return {
      name: data.name,
      club: data.club,
      points: sortedPoints.map((p: any) => ({
        divisionId: p.divisionId,
        weekName: p.weekName,
        level: p.level,
        victoryCount: p.victoryCount,
        forfeit: p.forfeit,
        pointsWon: p.pointsWon,
        matchId: p.matchId,
        matchUniqueId: p.matchUniqueId,
      })),
      levelAttributed: data.levelAttributed || '',
      history: sortedHistory.map((h: any) => ({
        points: h.points,
        level: h.level,
        position: h.position,
        weekName: h.weekName,
      })),
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
      weekName: data.weekName || 0,
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getPlayerDetails
  }
}

