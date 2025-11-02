import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Initialize Firebase
  const app: FirebaseApp = initializeApp(firebaseConfig)
  
  // Initialize Firestore
  const db: Firestore = getFirestore(app)
  
  // Disabled offline persistence to avoid proxy cloning issues with Vue reactivity
  // This is a known issue when combining Firebase offline persistence with Vue 3 reactivity
  // Users will still have real-time data from Firebase, just without offline caching

  // Provide Firestore instance to the app
  nuxtApp.provide('firebaseApp', app)
  nuxtApp.provide('firestore', db)
})

