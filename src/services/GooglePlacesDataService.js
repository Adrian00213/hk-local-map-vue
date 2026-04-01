// Google Places Real Restaurant Data Service
// Runtime-loaded from hk_food_places.json

// Map address keywords to correct districts
const ADDRESS_TO_DISTRICT = {
  '中西區': ['Central', 'Sheung Wan', 'Sai Ying Pun', 'Western', 'Mid-Levels', 'Victoria Peak', 'Admiralty', '中環', '上環', '西環', '金鐘', '山頂'],
  '灣仔': ['Wan Chai', 'Causeway Bay', 'Tin Hau', 'Causeway', 'Wanchai', '銅鑼灣', '天后', '跑馬地'],
  '東區': ['Eastern', 'North Point', 'Quarry Bay', 'Sai Wan Ho', 'Chai Wan', 'Siu Sai Wan', '北角', '鰂魚涌', '西灣河', '柴灣'],
  '南區': ['Southern', 'Aberdeen', 'Stanley', 'Repulse Bay', 'Deep Water Bay', 'Lantau', 'South Side', '香港仔', '赤柱', '南丫島', '長洲', '大嶼山'],
  '油尖旺': ['Tsim Sha Tsui', 'Mong Kok', 'Yau Ma Tei', 'Jordan', 'Kowloon City', 'TST', '旺角', '油麻地', '尖沙咀', '佐敦', '何文田'],
  '九龍城': ['Kowloon City', 'Kowloon Tong', 'Hung Hom', 'Whampoa', 'Lo Fu Hang', '九龍塘', '紅磡', '黃埔'],
  '深水埗': ['Sham Shui Po', 'Shek Kip Mei', 'Lai Chi Kok', 'Cheung Sha Wan', '長沙灣', '石硤尾', '又一村'],
  '黃大仙': ['Wong Tai Sin', 'Diamond Hill', '龍翔道', '慈雲山', '鑽石山'],
  '觀塘': ['Kwun Tong', 'Ngau Tau Kok', 'Jordan Valley', '觀塘市中心', '牛頭角', '九龍灣'],
  '葵青': ['Kwai Tsing', 'Kwai Chung', 'Tsing Yi', '葵涌', '青衣', '荔景', '葵芳'],
  '荃灣': ['Tsuen Wan', 'Discovery Bay', '荃灣市中心', '愉景新城', '萬景峰'],
  '屯門': ['Tuen Mun', 'So Kwun Wat', '屯門市中心', '良田'],
  '元朗': ['Yuen Long', 'Tin Shui Wai', 'Hung Shui Kiu', '元朗市中心', '形點', 'YOHO', '天水圍'],
  '北區': ['North District', 'Sheung Shui', 'Fanling', 'Sha Tau Kok', '上水', '粉嶺', '沙頭角', '打鼓嶺'],
  '西頁': ['Sai Kung', 'Tseung Kwan O', '將軍澳', '坑口', '寶琳', '康城', '調景嶺'],
  '沙田': ['Sha Tin', 'Ma On Shan', 'Tai Shui Hang', '沙田市中心', '馬鞍山', '大圍', '火炭', '沙田圍'],
  '大埔': ['Tai Po', 'Tai Po Town', '大埔墟', '科學園', '太和', '運頭塘'],
}

// Get correct district from address
const getDistrictFromAddress = (address = '') => {
  const addr = address.toUpperCase()
  for (const [district, keywords] of Object.entries(ADDRESS_TO_DISTRICT)) {
    for (const keyword of keywords) {
      if (addr.includes(keyword.toUpperCase())) {
        return district
      }
    }
  }
  return '其他'
}

// Transform the data to match app format with correct districts
const transformRestaurant = (r) => {
  const address = r.address || ''
  const correctDistrict = getDistrictFromAddress(address)
  const primaryType = r.types?.[0] || 'restaurant'
  
  return {
    id: `${r.lat}-${r.lng}-${r.name}`,
    name: r.name || 'Unknown',
    category: 'restaurants',
    lat: parseFloat(r.lat || 0),
    lng: parseFloat(r.lng || 0),
    address: address,
    district: correctDistrict,
    rating: r.rating || null,
    userRatingsTotal: r.userRatingsTotal || 0,
    priceLevel: r.priceLevel || null,
    type: primaryType,
    cuisine: primaryType,
    description: r.types?.filter(t => !['food', 'restaurant', 'point_of_interest', 'establishment'].includes(t)).join(', ') || '',
    price: r.priceLevel ? '$'.repeat(r.priceLevel) : '',
  }
}

// Default restaurant data (fallback if JSON fails to load)
const DEFAULT_RESTAURANTS = [
  { name: '麥當勞', address: '旺角彌敦道601號', lat: 22.3172, lng: 114.1686, rating: 4.2, types: ['restaurant', 'fast_food'], userRatingsTotal: 1000, priceLevel: 1 },
  { name: '肯德基', address: '尖沙咀加拿芬道18號', lat: 22.2956, lng: 114.1720, rating: 4.0, types: ['restaurant', 'fast_food'], userRatingsTotal: 800, priceLevel: 1 },
  { name: '譚仔三哥', address: '中環士丹利街18號', lat: 22.2808, lng: 114.1588, rating: 4.5, types: ['restaurant'], userRatingsTotal: 2000, priceLevel: 2 },
]

// All restaurants - loaded dynamically (exported for read access)
export let ALL_RESTAURANTS = DEFAULT_RESTAURANTS.map(transformRestaurant)
let dataLoaded = false

// Load data from JSON file
export const loadRestaurantData = async () => {
  if (dataLoaded) {
    console.log(`[RestaurantData] Already loaded: ${ALL_RESTAURANTS.length} places`)
    return ALL_RESTAURANTS
  }
  
  console.log('[RestaurantData] Loading data from ./data/hk_food_places.json...')
  
  try {
    const response = await fetch('./data/hk_food_places.json')
    if (response.ok) {
      const data = await response.json()
      ALL_RESTAURANTS = (data.places || []).map(transformRestaurant)
      dataLoaded = true
      console.log(`[RestaurantData] ✅ Loaded ${ALL_RESTAURANTS.length} places from JSON`)
    } else {
      console.error('[RestaurantData] ❌ Failed to fetch:', response.status)
    }
  } catch (e) {
    console.error('[RestaurantData] ❌ Failed to load:', e.message)
  }
  
  return ALL_RESTAURANTS
}

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
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
    r.cuisine?.toLowerCase().includes(type.toLowerCase())
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
    r.cuisine?.toLowerCase().includes(q)
  )
}

// Get cuisine types
export const getCuisineTypes = () => {
  const types = [...new Set(ALL_RESTAURANTS.map(r => r.type).filter(Boolean))]
  return types.sort()
}

// Stats
export const getRestaurantStats = () => ({
  total: ALL_RESTAURANTS.length,
  districts: getAllDistricts().length,
  withRating: ALL_RESTAURANTS.filter(r => r.rating).length,
  withPrice: ALL_RESTAURANTS.filter(r => r.priceLevel).length,
})

export default {
  loadRestaurantData,
  getRestaurantsByDistrict,
  getAllDistricts,
  getRestaurantsNearLocation,
  getAllRestaurantMarkers,
  getRestaurantById,
  getRestaurantsByType,
  getTopRatedRestaurants,
  searchRestaurants,
  getCuisineTypes,
  getRestaurantStats
}
