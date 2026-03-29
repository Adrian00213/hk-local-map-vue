import { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'

const MapContext = createContext()

export function useMap() {
  return useContext(MapContext)
}

// Category icons mapping
export const CATEGORY_ICONS = {
  deals: '🛒',
  restaurants: '🍜',
  places: '🎯',
  news: '📰'
}

// Category labels (Cantonese)
export const CATEGORY_LABELS = {
  deals: '優惠',
  restaurants: '餐廳',
  places: '好去處',
  news: '最新資訊'
}

// Mock data for demo (when Firebase is not configured)
const MOCK_MARKERS = [
  {
    id: '1',
    title: 'Nike Outlet 大特賣',
    category: 'deals',
    lat: 22.3193,
    lng: 114.1694,
    description: '全場低至5折！包括運動鞋、運動服裝',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    contact: '旺角朗豪坊',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '九龍公園',
    category: 'places',
    lat: 22.3021,
    lng: 114.1730,
    description: '市區綠洲，有鳥湖和免費表演',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    contact: '尖沙咀',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '義順牛奶公司',
    category: 'restaurants',
    lat: 22.3065,
    lng: 114.1707,
    description: '馳名雙皮奶、薑汁撞奶',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300',
    contact: '旺角弼街',
    userId: 'demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: '香港美食節 2026',
    category: 'news',
    lat: 22.3208,
    lng: 114.1761,
    description: '年度美食盛事，超過100間餐廳參與',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
    contact: '灣仔會展中心',
    userId: 'demo',
    createdAt: new Date().toISOString()
  }
]

export function MapProvider({ children }) {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  // Fetch markers from Firestore or use mock data
  const fetchMarkers = async () => {
    setLoading(true)
    try {
      const markersRef = collection(db, 'markers')
      const q = query(markersRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        // Use mock data when no data in Firebase
        setMarkers(MOCK_MARKERS)
      } else {
        const fetchedMarkers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMarkers(fetchedMarkers)
      }
    } catch (error) {
      console.log('Using mock data (Firebase not configured):', error.message)
      // Use mock data when Firebase fails
      setMarkers(MOCK_MARKERS)
    }
    setLoading(false)
  }

  // Add new marker
  const addMarker = async (markerData) => {
    try {
      const markersRef = collection(db, 'markers')
      const newMarker = {
        ...markerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const docRef = await addDoc(markersRef, newMarker)
      
      setMarkers(prev => [{
        id: docRef.id,
        ...newMarker
      }, ...prev])
      
      return docRef.id
    } catch (error) {
      console.error('Error adding marker:', error)
      throw error
    }
  }

  // Update marker
  const updateMarker = async (markerId, updates) => {
    try {
      const markerRef = doc(db, 'markers', markerId)
      await updateDoc(markerRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      
      setMarkers(prev => prev.map(marker => 
        marker.id === markerId 
          ? { ...marker, ...updates, updatedAt: new Date().toISOString() }
          : marker
      ))
    } catch (error) {
      console.error('Error updating marker:', error)
      throw error
    }
  }

  // Delete marker
  const deleteMarker = async (markerId) => {
    try {
      const markerRef = doc(db, 'markers', markerId)
      await deleteDoc(markerRef)
      
      setMarkers(prev => prev.filter(marker => marker.id !== markerId))
    } catch (error) {
      console.error('Error deleting marker:', error)
      throw error
    }
  }

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Default to Hong Kong center
          setUserLocation({ lat: 22.3193, lng: 114.1694 })
        }
      )
    } else {
      // Default to Hong Kong center
      setUserLocation({ lat: 22.3193, lng: 114.1694 })
    }
  }

  useEffect(() => {
    fetchMarkers()
    getUserLocation()
  }, [])

  const filteredMarkers = selectedCategory
    ? markers.filter(m => m.category === selectedCategory)
    : markers

  const value = {
    markers: filteredMarkers,
    allMarkers: markers,
    loading,
    selectedCategory,
    setSelectedCategory,
    userLocation,
    addMarker,
    updateMarker,
    deleteMarker,
    refreshMarkers: fetchMarkers
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}
