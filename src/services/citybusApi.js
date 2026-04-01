// Citybus ETA API Service
const BASE_URL = 'https://rt.data.gov.hk/v2/transport/citybus'

// Company ID for Citybus (includes former NWFB routes)
const COMPANY_ID = 'CTB'

// Format ETA time
const formatCitybusETA = (etaString) => {
  const eta = new Date(etaString)
  const now = new Date()
  const diffMs = eta - now
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins <= 0) return '即將到站'
  if (diffMins < 60) return `${diffMins} 分鐘`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return `${hours}小時${mins}分鐘`
}

// Get all Citybus routes
export const getCitybusRoutes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/route/${COMPANY_ID}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Citybus routes:', error)
    return []
  }
}

// Get route details
export const getCitybusRoute = async (route) => {
  try {
    const response = await fetch(`${BASE_URL}/route/${COMPANY_ID}/${route}`)
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching Citybus route:', error)
    return null
  }
}

// Get stop details
export const getCitybusStop = async (stopId) => {
  try {
    const response = await fetch(`${BASE_URL}/stop/${stopId}`)
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching Citybus stop:', error)
    return null
  }
}

// Get route stops
export const getCitybusRouteStops = async (route, direction) => {
  try {
    const response = await fetch(`${BASE_URL}/route-stop/${COMPANY_ID}/${route}/${direction}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Citybus route stops:', error)
    return []
  }
}

// Get stop ETA
export const getCitybusStopETA = async (stopId, route) => {
  try {
    const response = await fetch(`${BASE_URL}/eta/${COMPANY_ID}/${stopId}/${route}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Citybus stop ETA:', error)
    return []
  }
}

// Get all routes for a stop
export const getCitybusRoutesAtStop = async (stopId) => {
  try {
    // First get all routes, then filter (Citybus doesn't have a direct "routes at stop" API)
    const allRoutes = await getCitybusRoutes()
    // For now, return empty - actual implementation would need to call ETA for each route
    // or use a different approach
    return []
  } catch (error) {
    console.error('Error fetching Citybus routes at stop:', error)
    return []
  }
}

// Search Citybus stops by name (need to fetch all and filter - not ideal but Citybus doesn't have stop search API)
export const searchCitybusStops = async (query, existingStops = []) => {
  // If we already have stops cached, filter them
  if (existingStops.length > 0) {
    const searchLower = query.toLowerCase()
    return existingStops.filter(stop =>
      stop.name_tc?.includes(query) ||
      stop.name_en?.toLowerCase().includes(searchLower)
    )
  }
  return []
}

export { formatCitybusETA, COMPANY_ID }
