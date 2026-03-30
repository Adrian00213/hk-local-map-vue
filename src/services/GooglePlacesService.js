// Google Places Service using Maps JavaScript API
// This avoids CORS issues by using the already-loaded Google Maps API

let placesService = null
let mapInstance = null
let initAttempts = 0
const MAX_INIT_ATTEMPTS = 50 // 5 seconds max wait
const GOOGLE_MAPS_API_KEY = 'AIzaSyC4OsiPMTcrtqsIQB-3YGJIFcsJelBsZpw'

// Check if PlacesService is ready
export const isPlacesServiceReady = () => {
  return placesService !== null
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
  
  // Time-based search query
  const timeQueries = {
    morning: 'breakfast',
    noon: 'lunch restaurant',
    afternoon: 'café dessert',
    evening: 'dinner restaurant',
    night: 'night market food'
  }
  
  const query = timeQueries[timeContext] || 'restaurant'
  
  if (location) {
    // Use nearby search if we have location
    const nearbyResults = await searchNearby(location, { type: 'restaurant', limit: 15 })
    results.push(...nearbyResults)
    console.log('📍 Nearby results:', nearbyResults.length)
  }
  
  // Also try text search
  const textResults = await searchPlacesText(`${query} in ${region}`, { limit: 15 })
  results.push(...textResults)
  console.log('📝 Text results:', textResults.length)
  
  // Remove duplicates
  const unique = results.reduce((acc, place) => {
    if (!acc.find(p => p.name === place.name)) {
      acc.push(place)
    }
    return acc
  }, [])
  
  console.log('🎯 Total unique results:', unique.length)
  return unique.slice(0, 15)
}
