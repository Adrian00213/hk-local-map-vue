// Place Search Service - Google Places API
// Global coverage: HK, Taiwan, Japan, Korea, SE Asia, Europe

const GOOGLE_PLACES_API_KEY = 'AIzaSyC4OsiPMTcrtqsIQB-3YGJIFcsJelBsZpw'
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place'

// Region to language mapping
const REGION_LANG = {
  hong_kong: 'zh-HK',
  taiwan: 'zh-TW',
  japan: 'ja',
  korea: 'ko',
  se_asia: 'en',
  europe: 'en',
  global: 'en',
  china: 'zh-CN'
}

// Place type mapping for Google Places
const PLACE_TYPE_MAP = {
  restaurants: ['restaurant', 'cafe', 'food', 'bakery', 'meal_delivery', 'meal_takeaway'],
  places: ['tourist_attraction', 'park', 'museum', 'art_gallery', 'amusement_park', 'zoo', 'aquarium', 'shopping_mall', 'point_of_interest'],
  transport: ['transit_station', 'airport', 'bus_station', 'taxi_stand', 'train_station', 'subway_station'],
  shopping: ['shopping_mall', 'store', 'supermarket', 'convenience_store', 'clothing_store', 'shoe_store'],
  all: ['restaurant', 'cafe', 'tourist_attraction', 'park', 'museum', 'shopping_mall']
}

// Search places using Google Places Text Search
export const searchPlaces = async (region, query, options = {}) => {
  const { type = 'all', limit = 20 } = options
  const lang = REGION_LANG[region] || 'zh-HK'
  const types = PLACE_TYPE_MAP[type] || PLACE_TYPE_MAP.all
  
  try {
    // Build query string - simplified
    const searchQuery = `${query} ${region}`
    
    const url = `${GOOGLE_PLACES_URL}/textsearch/json?key=${GOOGLE_PLACES_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=${lang}`
    console.log('🔍 Calling:', url.substring(0, 100) + '...')
    
    const response = await fetch(url)
    console.log('📦 Response status:', response.status)
    const data = await response.json()
    
    console.log('📦 API Response status:', data.status, '- Results:', data.results?.length || 0)
    
    if (data.status === 'OK') {
      console.log('✅ Success! First result:', data.results?.[0]?.name)
      return (data.results || []).slice(0, limit).map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        rating: place.rating || null,
        price_level: place.price_level,
        types: place.types || [],
        category: mapTypesToCategory(place.types || []),
        photos: place.photos?.map(p => 
          `${GOOGLE_PLACES_URL}/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) || [],
        open_now: place.opening_hours?.open_now,
        provider: 'google'
      }))
    }
    
    // Handle specific API errors
    if (data.status === 'REQUEST_DENIED') {
      console.error('❌ Google Places API REQUEST_DENIED:', data.error_message)
      return []
    }
    
    if (data.status === 'OVER_QUERY_LIMIT') {
      console.error('❌ Google Places API OVER_QUERY_LIMIT')
      return []
    }
    
    if (data.status === 'INVALID_REQUEST') {
      console.error('❌ Google Places API INVALID_REQUEST:', data.error_message)
      return []
    }
    
    console.log('⚠️ Unknown status:', data.status)
    return []
  } catch (error) {
    console.error('❌ Google Places API exception:', error)
    return []
  }
}

// Get nearby places
export const getNearbyPlaces = async (lat, lng, options = {}) => {
  const { type = 'restaurants', radius = 3000, limit = 20 } = options
  
  const types = PLACE_TYPE_MAP[type] || PLACE_TYPE_MAP.restaurants
  
  try {
    const params = new URLSearchParams({
      key: GOOGLE_PLACES_API_KEY,
      location: `${lat},${lng}`,
      radius: radius,
      type: types[0]
    })
    
    const response = await fetch(`${GOOGLE_PLACES_URL}/nearbysearch/json?${params}`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return data.results.slice(0, limit).map(place => ({
        id: place.place_id,
        name: place.name,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        rating: place.rating || null,
        types: place.types || [],
        category: mapTypesToCategory(place.types || []),
        open_now: place.opening_hours?.open_now,
        provider: 'google'
      }))
    }
    
    return []
  } catch (error) {
    console.error('Google Places Nearby API error:', error)
    return []
  }
}

// Search with multiple types - simplified
export const searchPlacesMultiType = async (region, query, options = {}) => {
  const { limit = 15 } = options
  
  console.log('🔍 searchPlacesMultiType called:', { region, query, limit })
  
  // Just search for restaurants first
  const places = await searchPlaces(region, query, { type: 'restaurants', limit })
  
  console.log('📍 searchPlacesMultiType results:', places.length)
  
  return places.slice(0, limit)
}

// Alias for backward compatibility
export const smartSearchPlaces = searchPlacesMultiType
export { searchPlaces as searchGooglePlaces }

// Map Google types to our categories
const mapTypesToCategory = (types) => {
  const restaurantTypes = ['restaurant', 'cafe', 'food', 'bakery', 'meal_delivery', 'meal_takeaway']
  const attractionTypes = ['tourist_attraction', 'park', 'museum', 'art_gallery', 'amusement_park', 'zoo', 'aquarium']
  const shoppingTypes = ['shopping_mall', 'store', 'supermarket', 'convenience_store']
  const transportTypes = ['transit_station', 'airport', 'bus_station', 'taxi_stand', 'train_station', 'subway_station']
  
  if (types.some(t => restaurantTypes.includes(t))) return 'restaurants'
  if (types.some(t => attractionTypes.includes(t))) return 'places'
  if (types.some(t => shoppingTypes.includes(t))) return 'shopping'
  if (types.some(t => transportTypes.includes(t))) return 'transport'
  
  return 'places'
}

// Place details
export const getPlaceDetails = async (placeId) => {
  try {
    const params = new URLSearchParams({
      key: GOOGLE_PLACES_API_KEY,
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,price_level,types,photos,opening_hours,reviews,url'
    })
    
    const response = await fetch(`${GOOGLE_PLACES_URL}/details/json?${params}`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      const place = data.result
      return {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        rating: place.rating || null,
        price_level: place.price_level,
        types: place.types || [],
        category: mapTypesToCategory(place.types || []),
        photos: place.photos?.map(p => 
          `${GOOGLE_PLACES_URL}/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) || [],
        open_now: place.opening_hours?.open_now,
        reviews: place.reviews || [],
        provider: 'google'
      }
    }
    
    return null
  } catch (error) {
    console.error('Google Places Details API error:', error)
    return null
  }
}
