// Restaurant Data Service - OpenRice Data
// Data source: https://github.com/cal65/Open-Rice

// CSV data will be loaded dynamically
let restaurantCache = null

// Parse CSV data
const parseCSV = (csvText) => {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    const obj = {}
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] || ''
    })
    return obj
  })
}

// Load restaurants data
const loadRestaurants = async () => {
  if (restaurantCache) return restaurantCache
  
  try {
    // Try multiple paths for compatibility with different hosting setups
    let csvText = null
    
    // Try relative path first (works with base: './')
    try {
      const response = await fetch('./data/restaurants.csv')
      if (response.ok) {
        csvText = await response.text()
      }
    } catch (e) {}
    
    // Fallback to absolute path
    if (!csvText) {
      const response = await fetch('/hk-local-map-vue/data/restaurants.csv')
      if (response.ok) {
        csvText = await response.text()
      }
    }
    
    // Last fallback to original path
    if (!csvText) {
      const response = await fetch('/hk-local-map/data/restaurants.csv')
      csvText = await response.text()
    }
    
    restaurantCache = parseCSV(csvText)
    return restaurantCache
  } catch (e) {
    console.error('Error loading restaurants:', e)
    return []
  }
}

// Synchronous access with cached data
let cachedRestaurants = null

export const getAllRestaurants = () => {
  return cachedRestaurants || []
}

export const initRestaurants = async () => {
  cachedRestaurants = await loadRestaurants()
  return cachedRestaurants
}

// Get restaurants by district
export const getRestaurantsByDistrict = (district) => {
  const all = getAllRestaurants()
  return all.filter(r => r.Districts === district)
}

// Get nearby restaurants
export const getNearbyRestaurants = (lat, lon, radiusKm = 2) => {
  const all = getAllRestaurants()
  return all.filter(r => {
    const rLat = parseFloat(r.lat)
    const rLon = parseFloat(r.lon)
    if (isNaN(rLat) || isNaN(rLon)) return false
    
    const distance = getDistance(lat, lon, rLat, rLon)
    return distance <= radiusKm
  }).map(r => ({
    ...r,
    distance: getDistance(lat, lon, parseFloat(r.lat), parseFloat(r.lon))
  })).sort((a, b) => a.distance - b.distance)
}

// Calculate distance between two points (Haversine formula)
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Get top rated restaurants
export const getTopRatedRestaurants = (limit = 20) => {
  const all = getAllRestaurants()
  return all
    .filter(r => parseInt(r.smiles) > 50)
    .sort((a, b) => parseInt(b.smiles) - parseInt(a.smiles))
    .slice(0, limit)
}

// Get restaurants by cuisine type
export const getRestaurantsByCuisine = (cuisineType) => {
  const all = getAllRestaurants()
  const search = cuisineType.toLowerCase()
  return all.filter(r => 
    (r.type1 && r.type1.toLowerCase().includes(search)) ||
    (r.type2 && r.type2.toLowerCase().includes(search)) ||
    (r.type3 && r.type3.toLowerCase().includes(search)) ||
    (r.type4 && r.type4.toLowerCase().includes(search))
  )
}

// Get cuisine types
export const getCuisineTypes = () => {
  const all = getAllRestaurants()
  const types = new Set()
  all.forEach(r => {
    if (r.type1) types.add(r.type1)
    if (r.type2) types.add(r.type2)
    if (r.type3) types.add(r.type3)
    if (r.type4) types.add(r.type4)
  })
  return Array.from(types).filter(t => t).sort()
}

// Get districts
export const getDistricts = () => {
  const all = getAllRestaurants()
  const districts = new Set()
  all.forEach(r => {
    if (r.Districts) districts.add(r.Districts)
  })
  return Array.from(districts).sort()
}

// Format price range
export const formatPrice = (price) => {
  if (!price) return '未知'
  if (price.includes('Below')) return '$50以下'
  if (price.includes('$201')) return '$201-$400'
  if (price.includes('$101')) return '$101-$200'
  if (price.includes('$51')) return '$51-$100'
  return price
}

// Get popularity score
export const getPopularityScore = (restaurant) => {
  const smiles = parseInt(restaurant.smiles) || 0
  const frowns = parseInt(restaurant.frowns) || 0
  if (smiles + frowns === 0) return 0
  return Math.round((smiles / (smiles + frowns)) * 100)
}
