// Firebase configuration
// Replace these values with your own Firebase project config
// Get your config from: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// For demo purposes, we use a placeholder config
// In production, use environment variables or a config file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
}

// Initialize Firebase
let app
let auth
let db
let storage

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} catch (error) {
  console.warn('Firebase initialization error:', error.message)
  // Create dummy objects for demo mode
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null)
      return () => {}
    }
  }
  db = {
    collection: () => ({
      addDoc: async () => ({ id: 'demo-' + Date.now() }),
      getDocs: async () => ({ empty: true, docs: [] }),
      doc: () => ({})
    })
  }
  storage = {
    ref: () => ({ put: async () => ({}) })
  }
}

export { auth }
export { db }
export { storage }
export default app
