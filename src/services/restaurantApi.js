// Restaurant Data Service - Wrapper around GooglePlacesDataService
// Uses the collected 6352+ real HK food places

import { 
  ALL_RESTAURANTS,
  loadRestaurantData,
  getRestaurantsByDistrict,
  getAllDistricts,
  getRestaurantsNearLocation,
  getAllRestaurantMarkers,
  getRestaurantById,
  getRestaurantsByType,
  getTopRatedRestaurants as getTopRated,
  searchRestaurants,
  getCuisineTypes as getCuisineTypesFromData,
  getRestaurantStats,
  calculateDistance
} from './GooglePlacesDataService'

export { calculateDistance }

// Get all restaurants
export const getAllRestaurants = async () => {
  await loadRestaurantData()
  return ALL_RESTAURANTS
}

// Get nearby restaurants based on user location
export const getNearbyRestaurants = async (lat, lng, radiusKm = 5) => {
  await loadRestaurantData()
  return getRestaurantsNearLocation(lat, lng, radiusKm)
}

// Get top rated restaurants
export const getTopRatedRestaurants = async (limit = 50) => {
  await loadRestaurantData()
  return getTopRated(limit)
}

// Get restaurants by cuisine
export const getRestaurantsByCuisine = async (cuisine) => {
  await loadRestaurantData()
  return getRestaurantsByType(cuisine)
}

// Get cuisine types
export const getCuisineTypes = async () => {
  await loadRestaurantData()
  return getCuisineTypesFromData()
}

// Format price range
export const formatPrice = (price) => {
  return price || '$'
}

// Get popularity score
export const getPopularityScore = (restaurant) => {
  return Math.floor(Math.random() * 50) + (restaurant.rating || 0) * 10
}

// Initialize restaurants
export const initRestaurants = async () => {
  console.log('[RestaurantApi] initRestaurants called')
  await loadRestaurantData()
  console.log(`[RestaurantApi] ✅ Initialized with ${ALL_RESTAURANTS.length} restaurants`)
  return true
}
