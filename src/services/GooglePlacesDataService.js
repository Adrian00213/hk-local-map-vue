// Google Places Real Restaurant Data Service
// Loads real restaurant data from hk_restaurants.json (857 restaurants from Google Places API)

import HK_RESTAURANTS_DATA from '../../scripts/hk_restaurants.json'

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
const transformRestaurant = (r, index) => {
  const address = r.address || r.vicinity || r.Districts || ''
  const correctDistrict = getDistrictFromAddress(address)
  
  return {
    id: r.placeId || `restaurant-${index}`,
    name: r.name || r.restaurant_name || 'Unknown',
    category: 'restaurants',
    lat: parseFloat(r.lat || r.geometry?.location?.lat || 0),
    lng: parseFloat(r.lng || r.geometry?.location?.lng || 0),
    address: address,
    district: correctDistrict,
    originalDistrict: r.district || '',
    rating: r.rating || null,
    userRatingsTotal: r.userRatingsTotal || 0,
    priceLevel: r.priceLevel || r.price_level || null,
    type: r.types?.[0] || r.type1 || 'restaurant',
    phone: r.international_phone_number || r.phone || '',
    openNow: r.openNow || r.opening_hours?.open_now || null,
    description: r.types ? r.types.filter(t => !['food', 'restaurant', 'point_of_interest', 'establishment']).slice(0, 3).join(', ') : ''
  }
}

// All restaurants
export const ALL_RESTAURANTS = (HK_RESTAURANTS_DATA.restaurants || []).map(transformRestaurant)

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
