// Firebase configuration
// Replace these values with your own Firebase project config
// Get your config from: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCNjxklbpJ4RvISrLrWulL85IxDEIG5jnNA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hk-local-map.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hk-local-map",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hk-local-map.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FITE_MESSAGING_SENDER_ID || "820852428321",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:820852428321:web:bfbed28c5a688fece25d60"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
export default app
