// Google Places Real Restaurant Data Service
// Loads real restaurant data from hk_restaurants.json (857 restaurants from Google Places API)

import HK_RESTAURANTS_DATA from '../../scripts/hk_restaurants.json'

// Transform the data to match app format
const transformRestaurant = (r, index) => ({
  id: r.placeId || `restaurant-${index}`,
  name: r.name || r.restaurant_name || 'Unknown',
  category: 'restaurants',
  lat: parseFloat(r.lat || r.geometry?.location?.lat || 0),
  lng: parseFloat(r.lng || r.geometry?.location?.lng || 0),
  address: r.address || r.vicinity || r.Districts || '',
  district: r.district || '',
  rating: r.rating || null,
  userRatingsTotal: r.userRatingsTotal || 0,
  priceLevel: r.priceLevel || r.price_level || null,
  type: r.types?.[0] || r.type1 || 'restaurant',
  phone: r.international_phone_number || r.phone || '',
  openNow: r.openNow || r.opening_hours?.open_now || null,
  description: r.types ? r.types.filter(t => !['food', 'restaurant', 'point_of_interest', 'establishment']).slice(0, 3).join(', ') : ''
})

// All restaurants
const ALL_RESTAURANTS = (HK_RESTAURANTS_DATA.restaurants || []).map(transformRestaurant)

// Get restaurants by district
export const getRestaurantsByDistrict = (district) => {
  return ALL_RESTAURANTS.filter(r => r.district === district)
}

// Get all districts
export const getAllDistricts = () => {
  const districts = [...new Set(ALL_RESTAURANTS.map(r => r.district).filter(Boolean))]
  return districts.sort()
}

// Get restaurants near a location
export const getRestaurantsNearLocation = (lat, lng, radiusKm = 5) => {
  return ALL_RESTAURANTS.filter(r => {
    if (!r.lat || !r.lng) return false
    const distance = calculateDistance(lat, lng, r.lat, r.lng)
    return distance <= radiusKm
  })
}

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Get all restaurants as markers for map
export const getAllRestaurantMarkers = () => {
  return ALL_RESTAURANTS.filter(r => r.lat && r.lng)
}

// Get restaurant by ID
export const getRestaurantById = (id) => {
  return ALL_RESTAURANTS.find(r => r.id === id)
}

// Get restaurants by cuisine/type
export const getRestaurantsByType = (type) => {
  return ALL_RESTAURANTS.filter(r => 
    r.type?.toLowerCase().includes(type.toLowerCase()) ||
    r.description?.toLowerCase().includes(type.toLowerCase())
  )
}

// Get top rated restaurants
export const getTopRatedRestaurants = (limit = 50) => {
  return ALL_RESTAURANTS
    .filter(r => r.rating)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// Search restaurants
export const searchRestaurants = (query) => {
  const q = query.toLowerCase()
  return ALL_RESTAURANTS.filter(r =>
    r.name?.toLowerCase().includes(q) ||
    r.district?.toLowerCase().includes(q) ||
    r.address?.toLowerCase().includes(q) ||
    r.type?.toLowerCase().includes(q) ||
    r.description?.toLowerCase().includes(q)
  )
}

// Stats
export const getRestaurantStats = () => ({
  total: ALL_RESTAURANTS.length,
  districts: getAllDistricts().length,
  withRating: ALL_RESTAURANTS.filter(r => r.rating).length,
  withPrice: ALL_RESTAURANTS.filter(r => r.priceLevel).length,
})

export default {
  getRestaurantsByDistrict,
  getAllDistricts,
  getRestaurantsNearLocation,
  getAllRestaurantMarkers,
  getRestaurantById,
  getRestaurantsByType,
  getTopRatedRestaurants,
  searchRestaurants,
  getRestaurantStats
}
