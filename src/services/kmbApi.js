// KMB ETA API Service
const BASE_URL = 'https://data.etabus.gov.hk'

// Cache for routes
let routesCache = null
let routesCacheTime = 0
const CACHE_DURATION = 60000 // 1 minute

// Format time difference
const formatETA = (etaString) => {
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

// Get route list (with optional query filter)
export const getRouteList = async (query = '') => {
  try {
    // Use cache if available and fresh
    const now = Date.now()
    if (routesCache && (now - routesCacheTime) < CACHE_DURATION) {
      if (query) {
        return routesCache.filter(r => r.route.includes(query.toUpperCase()))
      }
      return routesCache
    }

    const response = await fetch(`${BASE_URL}/v1/transport/kmb/route/`)
    const data = await response.json()
    routesCache = data.data || []
    routesCacheTime = now
    
    if (query) {
      return routesCache.filter(r => r.route.includes(query.toUpperCase()))
    }
    return routesCache
  } catch (error) {
    console.error('Error fetching route list:', error)
    return []
  }
}

// Get route details
export const getRoute = async (route, direction, serviceType) => {
  try {
    const response = await fetch(`${BASE_URL}/v1/transport/kmb/route/${route}/${direction}/${serviceType}`)
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching route:', error)
    return null
  }
}

// Get stop list (with optional query filter)
export const getStopList = async (query = '') => {
  try {
    // Use cache if available and fresh
    const now = Date.now()
    if (getStopList.cache && (now - getStopList.cacheTime) < CACHE_DURATION) {
      if (query) {
        const q = query.toLowerCase()
        return getStopList.cache.filter(stop =>
          stop.name_tc.includes(query) ||
          stop.name_en.toLowerCase().includes(q) ||
          stop.name_sc.includes(query)
        )
      }
      return getStopList.cache
    }

    const response = await fetch(`${BASE_URL}/v1/transport/kmb/stop`)
    const data = await response.json()
    getStopList.cache = data.data || []
    getStopList.cacheTime = now
    
    if (query) {
      const q = query.toLowerCase()
      return getStopList.cache.filter(stop =>
        stop.name_tc.includes(query) ||
        stop.name_en.toLowerCase().includes(q) ||
        stop.name_sc.includes(query)
      )
    }
    return getStopList.cache
  } catch (error) {
    console.error('Error fetching stop list:', error)
    return []
  }
}

// Get stop details
export const getStop = async (stopId) => {
  try {
    const response = await fetch(`${BASE_URL}/v1/transport/kmb/stop/${stopId}`)
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching stop:', error)
    return null
  }
}

// Get route-stop list (with optional route filter)
export const getRouteStopList = async (route = '', bound = '', serviceType = '') => {
  try {
    // Use cache if available
    const now = Date.now()
    if (getRouteStopList.cache && (now - getRouteStopList.cacheTime) < CACHE_DURATION) {
      let results = getRouteStopList.cache
      if (route) {
        results = results.filter(r => r.route === route)
        if (bound) results = results.filter(r => r.bound === bound)
        if (serviceType) results = results.filter(r => r.service_type === serviceType)
      }
      return results
    }

    const response = await fetch(`${BASE_URL}/v1/transport/kmb/route-stop`)
    const data = await response.json()
    getRouteStopList.cache = data.data || []
    getRouteStopList.cacheTime = now
    
    let results = getRouteStopList.cache
    if (route) {
      results = results.filter(r => r.route === route)
      if (bound) results = results.filter(r => r.bound === bound)
      if (serviceType) results = results.filter(r => r.service_type === serviceType)
    }
    return results
  } catch (error) {
    console.error('Error fetching route-stop list:', error)
    return []
  }
}

// Get stop ETA (real-time)
export const getStopETA = async (stopId) => {
  try {
    const response = await fetch(`${BASE_URL}/v1/transport/kmb/stop-eta/${stopId}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching stop ETA:', error)
    return []
  }
}

// Get route ETA
export const getRouteETA = async (route, serviceType) => {
  try {
    const response = await fetch(`${BASE_URL}/v1/transport/kmb/route-eta/${route}/${serviceType}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching route ETA:', error)
    return []
  }
}

// Search stops by name
export const searchStops = async (query) => {
  const stops = await getStopList()
  const searchLower = query.toLowerCase()
  return stops.filter(stop => 
    stop.name_tc.includes(query) ||
    stop.name_en.toLowerCase().includes(searchLower) ||
    stop.name_sc.includes(query)
  )
}

// Get routes for a stop
export const getRoutesForStop = async (stopId) => {
  const routeStops = await getRouteStopList()
  const routeList = await getRouteList()
  
  // Find routes that serve this stop
  const stopRoutes = routeStops.filter(rs => rs.stop === stopId)
  
  // Enrich with route details
  const enrichedRoutes = []
  for (const sr of stopRoutes) {
    const routeInfo = routeList.find(r => 
      r.route === sr.route && 
      r.bound === sr.bound && 
      r.service_type === sr.service_type
    )
    if (routeInfo) {
      enrichedRoutes.push({
        ...routeInfo,
        seq: sr.seq
      })
    }
  }
  
  return enrichedRoutes
}

export { formatETA }
