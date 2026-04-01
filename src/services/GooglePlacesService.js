// Google Places Service using Maps JavaScript API
// This avoids CORS issues by using the already-loaded Google Maps API

let placesService = null
let mapInstance = null
let initAttempts = 0
const MAX_INIT_ATTEMPTS = 50 // 5 seconds max wait
const GOOGLE_MAPS_API_KEY = 'AIzaSyC4OsiPMTcrtqsIQB-3YGJIFcsJelBsZpw'

// Import our collected Places data
import { ALL_RESTAURANTS, getTopRatedRestaurants, calculateDistance } from './GooglePlacesDataService'

// Check if PlacesService is ready
export const isPlacesServiceReady = () => {
  return placesService !== null
}

// Get our local places data
export const getLocalPlaces = () => {
  return ALL_RESTAURANTS
}

// Calculate distance and sort by distance
export const getPlacesSortedByDistance = (lat, lng, limit = 15) => {
  if (!lat || !lng) return ALL_RESTAURANTS.slice(0, limit)
  
  return ALL_RESTAURANTS
    .filter(p => p.lat && p.lng)
    .map(p => ({
      ...p,
      distance: calculateDistance(lat, lng, p.lat, p.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

// Initialize Places Service with retry
export const initPlacesService = (map) => {
  if (window.google?.maps?.places) {
    placesService = new window.google.maps.places.PlacesService(map)
    mapInstance = map
    initAttempts = 0
    console.log('✅ PlacesService initialized')
    return true
  }
  initAttempts++
  if (initAttempts < MAX_INIT_ATTEMPTS) {
    console.log(`⏳ PlacesService not ready, attempt ${initAttempts}/${MAX_INIT_ATTEMPTS}`)
    // Use a closure to retry with the same map
    setTimeout(() => {
      initPlacesService(map)
    }, 100)
  } else {
    console.log('❌ PlacesService failed to initialize after max attempts')
  }
  return false
}

// Reset init attempts (call this when map changes)
export const resetPlacesService = () => {
  initAttempts = 0
  placesService = null
  mapInstance = null
}

// Get photo URL from photo reference
const getPhotoUrl = (photoReference) => {
  if (!photoReference) return null
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`
}

// Search places using TextSearch (similar to REST API)
export const searchPlacesText = (query, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!placesService) {
      console.log('⚠️ PlacesService not ready, using sample data')
      resolve([])
      return
    }

    const request = {
      query: query,
      fields: ['name', 'geometry', 'rating', 'price_level', 'types', 'photos', 'opening_hours', 'formatted_address', 'place_id', 'user_ratings_total']
    }

    placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        console.log('✅ TextSearch success:', results.length, 'results')
        const mapped = results.slice(0, options.limit || 20).map(place => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
          rating: place.rating || null,
          price_level: place.price_level,
          types: place.types || [],
          category: mapTypesToCategory(place.types || []),
          address: place.formatted_address,
          open_now: place.opening_hours?.isOpen(),
          photos: place.photos ? place.photos.map(p => getPhotoUrl(p.photo_reference)) : [],
          user_ratings_total: place.user_ratings_total || 0,
          provider: 'google_maps_js'
        }))
        resolve(mapped)
      } else {
        console.log('❌ TextSearch failed:', status)
        resolve([])
      }
    })
  })
}

// Nearby Search
export const searchNearby = (location, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!placesService) {
      resolve([])
      return
    }

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: options.radius || 3000,
      type: options.type || 'restaurant'
    }

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        console.log('✅ NearbySearch success:', results.length, 'results')
        const mapped = results.slice(0, options.limit || 20).map(place => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
          rating: place.rating || null,
          types: place.types || [],
          category: mapTypesToCategory(place.types || []),
          open_now: place.opening_hours?.isOpen(),
          photos: place.photos ? place.photos.slice(0, 3).map(p => getPhotoUrl(p.photo_reference)) : [],
          user_ratings_total: place.user_ratings_total || 0,
          provider: 'google_maps_js'
        }))
        resolve(mapped)
      } else {
        console.log('❌ NearbySearch failed:', status)
        resolve([])
      }
    })
  })
}

// Map Google types to our categories
const mapTypesToCategory = (types) => {
  const restaurantTypes = ['restaurant', 'cafe', 'food', 'bakery', 'meal_delivery', 'meal_takeaway']
  const attractionTypes = ['tourist_attraction', 'park', 'museum', 'art_gallery', 'amusement_park', 'zoo', 'aquarium']
  const shoppingTypes = ['shopping_mall', 'store', 'supermarket', 'convenience_store']
  
  if (types.some(t => restaurantTypes.includes(t))) return 'restaurants'
  if (types.some(t => attractionTypes.includes(t))) return 'places'
  if (types.some(t => shoppingTypes.includes(t))) return 'shopping'
  
  return 'places'
}

// Combined search for recommendations
export const searchForRecommendations = async (region, timeContext, location) => {
  console.log('🔍 searchForRecommendations called:', { region, timeContext, hasLocation: !!location })
  
  const results = []
  
  // Time-based category preference
  const timeCategories = {
    morning: ['cafe', 'bakery', 'restaurant'],
    noon: ['restaurant', 'cafe'],
    afternoon: ['cafe', 'bakery', 'restaurant'],
    evening: ['restaurant', 'bar'],
    night: ['bar', 'restaurant', 'cafe']
  }
  
  // Get local places as primary source
  let localPlaces = ALL_RESTAURANTS
  
  if (location && location.lat && location.lng) {
    // Sort by distance if location available
    localPlaces = getPlacesSortedByDistance(location.lat, location.lng, 50)
  } else {
    // Otherwise get top rated
    localPlaces = getTopRatedRestaurants(50)
  }
  
  // Filter by time-based category preference
  const preferredCategories = timeCategories[timeContext] || ['restaurant']
  
  // Get places matching preferred categories
  const categorizedPlaces = localPlaces.filter(p => 
    preferredCategories.some(cat => p.type?.includes(cat) || p.cuisine?.includes(cat))
  )
  
  // Get top rated as fallback
  const topRated = getTopRatedRestaurants(20)
  
  // Combine categorized and top rated
  const combined = [...categorizedPlaces.slice(0, 10), ...topRated.slice(0, 10)]
  
  // Remove duplicates and map to result format
  const seen = new Set()
  const unique = combined.filter(p => {
    if (seen.has(p.name)) return false
    seen.add(p.name)
    return true
  }).slice(0, 15).map(p => ({
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    rating: p.rating,
    price_level: p.priceLevel,
    types: [p.type],
    category: p.type || 'restaurant',
    address: p.address,
    distance: p.distance,
    user_ratings_total: p.userRatingsTotal,
    provider: 'local_data'
  }))
  
  console.log('🎯 Local data results:', unique.length)
  return unique
}
