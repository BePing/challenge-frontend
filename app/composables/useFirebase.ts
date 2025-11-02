import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Composable to access Firebase/Firestore instance
 * Provides the Firestore database instance for queries
 * Returns null during SSR - only available on client side
 */
export const useFirebase = () => {
  // Only access Firebase on client side
  if (import.meta.server) {
    return {
      firestore: null
    }
  }
  
  const nuxtApp = useNuxtApp()
  
  const firestore = nuxtApp.$firestore as Firestore | undefined
  
  if (!firestore) {
    // Return null instead of throwing during SSR/initial render
    return {
      firestore: null
    }
  }
  
  return {
    firestore
  }
}

