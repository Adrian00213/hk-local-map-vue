// Google Places Real Restaurant Data Service
// Runtime-loaded from hk_nearby_500.json (500 nearest places, 164KB)
// Plus local HK restaurants for authentic local food experience

// Map address keywords to correct districts
const ADDRESS_TO_DISTRICT = {
  '中西區': ['Central', 'Sheung Wan', 'Sai Ying Pun', 'Western', 'Mid-Levels', 'Victoria Peak', 'Admiralty', '中環', '上環', '西環', '金鐘', '山頂', '中環站', '上環站', '金鐘站', '中環站', '半山', '荷李活道', '德輔道', '干諾道', '皇后大道', '畢打街', '泄蘭街', '蘇豪', '蘭桂坊', '砵甸乍街', '鱷魚背心', '正街', '水街', '屈地街', '山道', '欽州街', '大角咀', 'Queensway', 'Pacific Place', 'Lippo Centre', 'D\'Aguilar', 'The Peak', 'Peak Road', 'Peak Galleria', 'Watford', '皇后大道西', 'Queen\'s Road West', '上環站', '山頂纜車'],
  '灣仔': ['Wan Chai', 'Causeway Bay', 'Tin Hau', 'Causeway', 'Wanchai', '銅鑼灣', '天后', '跑馬地', '灣仔', '銅鑼灣站', '天后站', '灣仔站', '軒尼詩道', '謝斐道', '駱克道', '盧押道', '告示打道', '謝填道', '愛群道', '永祥街', '克街', '堅尼地道', '大有廣場', '時代廣場', '希慎廣場', 'WTG', 'WTG More'],
  '東區': ['Eastern', 'North Point', 'Quarry Bay', 'Sai Wan Ho', 'Chai Wan', 'Siu Sai Wan', '北角', '鰂魚涌', '西灣河', '柴灣', '北角站', '鰂魚涌站', '西灣河站', '柴灣站', '健康西街', '芬尼街', '船塢里', '渣華道', '電氣道', '和富道', '康山道', '太古城', '太古城道', '南安街', '祐民街', '金華街', '健康街', '寶文街'],
  '南區': ['Southern', 'Aberdeen', 'Stanley', 'Repulse Bay', 'Deep Water Bay', 'Lantau', 'South Side', '香港仔', '赤柱', '南丫島', '長洲', '大嶼山', '香港仔站', '赤柱站', '淺水灣', '舂坎角', '南灣', '海洋公園', '黃竹坑', '黃竹坑道', '海洋公園道', '惠福道', '漁光道', '石排灣', '香港仔大道', '南寧街', '湖北街', '崇文街', '洛陽街', '南昌街', '天虹道'],
  '油尖旺': ['Tsim Sha Tsui', 'Mong Kok', 'Yau Ma Tei', 'Jordan', 'Kowloon City', 'TST', '旺角', '油麻地', '尖沙咀', '佐敦', '何文田', '旺角站', '油麻地站', '尖沙咀站', '佐敦站', '柯士甸道', '彌敦道', '加連威老道', '海防道', '漢口道', '樂道', '漆咸道', '山林道', '金巴利道', '麼地道', '厚福街', '寶勒巷', '漆咸道南', '梳士巴利道', '廣東道', '窩打老道', '登打士街', '砵蘭街', '上海街', '廟街', '花園街', '通菜街', '洗衣街', '弼街', '運動場道', '荔枝角道', '大南街', '基隆街', '長沙灣道', '欽州街', '汝州街', '南昌街', '福華街', '桂林街', '永隆街', '北河街', '西九龍', 'West Kowloon', '九龍站', '柯士甸', '博物館', 'M+', '圓方', 'Elements', '南昌站', '海麗', 'moko', '朗豪坊', '奧運站', '太子站'],
  '九龍城': ['Kowloon City', 'Kowloon Tong', 'Hung Hom', 'Whampoa', 'Lo Fu Hang', '九龍塘', '紅磡', '黃埔', '九龍城', '紅磡站', '黃埔站', '九龍城站', '九龍塘站', '紅磡站', '鶴園道', '必嘉街', '溫思勞街', '戴亞街', '民裕道', '石裂街', '安徽街', '順序街', '鶴園東街', '機利士南路', '蕪湖街', '差館里', '馬頭圍道', '土瓜灣道', '新山道', '上鄉道', '下鄉道', '北帝街', '木廠街', '南角道', '龍崗道', '福佬村道', '侯王道', '城南道'],
  '深水埗': ['Sham Shui Po', 'Shek Kip Mei', 'Lai Chi Kok', 'Cheung Sha Wan', '長沙灣', '石硤尾', '又一村', '深水埗', '長沙灣站', '石硤尾站', '深水埗站', '荔枝角站', '美孚站', '長沙灣道', '荔枝角道', '南昌街', '欽州街', '汝州街', '基隆街', '順寧道', '保安道', '廣利道', '沅州街', '北河街', '福華街', '桂林街', '永隆街', '元州街', '耀東街', '耀華街', '海壇街', '醫局街', '欽州街', '通州街', '景福建', '南昌邨', '白田邨', '石硤尾邨', '又一村'],
  '黃大仙': ['Wong Tai Sin', 'Diamond Hill', '龍翔道', '慈雲山', '鑽石山', '黃大仙', '黃大仙站', '黃大仙警署', '沙田坳道', '鳳凰新邨', '竹園道', '彩虹道', '蒲崗村道', '富美街', '毓華街', '毓華里', '崇華街', '盈鳳里', '鳴鳳街', '翠鳳街', '金鳳街', '沙田', '橫頭磡', '樂富', '樂富廣場', '康強街', '天馬苑', '翠竹花園'],
  '觀塘': ['Kwun Tong', 'Ngau Tau Kok', 'Jordan Valley', '觀塘市中心', '牛頭角', '九龍灣', '觀塘', '牛頭角站', '九龍灣站', '觀塘站', 'apm', '創紀之城', '觀塘道', '開源道', '偉業街', '基業街', '海濱道', '巧明街', '興業街', '成業街', '鯉魚門', '鯉魚門道', '鯉魚門墟', '祟仁街', '輔仁街', '仁愛圍', '同仁街', '曉埋物', '牛頭角道', '九龍灣道', '宏照道', '常悅道', '永華道', '永時道'],
  '葵青': ['Kwai Tsing', 'Kwai Chung', 'Tsing Yi', '葵涌', '青衣', '荔景', '葵芳', '葵芳站', '青衣站', '荔景站', '葵興站', '葵涌站', '葵芳', '葵涌道', '葵喜街', '葵盛圍', '禾塘', '打磚坪街', '藍田街', '健全街', '大叫', '大白田', '荔景', '荔景山路', '青衣路', '青衣鄉事會路', '涌美路', '寮肚路', '梨木樹', '石籬', '安蔭'],
  '荃灣': ['Tsuen Wan', 'Discovery Bay', '荃灣市中心', '愉景新城', '萬景峰', '荃灣', '荃灣站', '荃灣西站', '大窪口站', '川龍街', '兆和街', '沙咀道', '大河道', '楊屋道', '青山公路', '德士古道', '昌寧路', '曹公潭', '柴灣角', '海盛路', '麗城', '灣景花園', '海濱花園', '爵悅庭', '荃灣廣場', '荃新天地', '萬玩玩'],
  '屯門': ['Tuen Mun', 'So Kwun Wat', '屯門市中心', '良田', '屯門', '屯門站', '市中心', '青山公路', '青山路', '龍門路', '湖山路', '井財街', '新墟', '舊墟', '置樂', '三聖', '掃管笏', '黃金海岸', '小欖', '大欖', '屯門南', '友愛', '安定', '兆康', '景峰', '富泰', '美樂', '蝴蝶灣', '蝴蝶邨'],
  '元朗': ['Yuen Long', 'Tin Shui Wai', 'Hung Shui Kiu', '元朗市中心', '形點', 'YOHO', '天水圍', '元朗', '元朗站', '天水圍站', '洪水橋', '廈村', '屏山', '十八鄉', '八鄉', '錦田', '石崗', '落馬洲', '元朗大馬路', '教育路', '大棠路', '馬田路', '擊壤路', '牡丹街', '阜嘯街', '元朗廣場', '形點', 'YOHO', '天水圍', '天耀邨', '天瑞邨', '天華邨', '天慈邨', '天盛苑', '天富苑', '天頌苑'],
  '北區': ['North District', 'Sheung Shui', 'Fanling', 'Sha Tau Kok', '上水', '粉嶺', '沙頭角', '打鼓嶺', '上水站', '粉嶺站', '沙頭角站', '打鼓嶺站', '上水廣場', '粉嶺中心', '榮輝中心', '祥華邨', '塘坊', '新康街', '聯和墟', '和合石', '和睦路', '粉嶺樓', '沙頭角道', '蓮麻坑路', '坪輋路', '恐龍坑', '打鼓嶺路'],
  '西頁': ['Sai Kung', 'Tseung Kwan O', '將軍澳', '坑口', '寶琳', '康城', '調景嶺', '西貢', '將軍澳站', '坑口站', '寶琳站', '康城站', '調景嶺站', '西頁墟', '翠林邨', '康盛花園', '景明苑', '煜明苑', '顯明苑', '寶林邨', '茵怡花園', '慧雲山', '南豐廣場', '新都城', 'TKO', 'TKO詳', '尚德邨', '廣明苑', '寶盈花園', '厚德邨', '富康花園', '麗港城', '新寶城', '海晴居', 'MONTEREY', '海翩', '滙天地'],
  '沙田': ['Sha Tin', 'Ma On Shan', 'Tai Shui Hang', '沙田市中心', '馬鞍山', '大圍', '火炭', '沙田圍', '沙田', '沙田站', '大圍站', '馬鞍山站', '第一城', '沙田第一城', '愉翠苑', '禾輋邨', '威爾斯親王醫院', '中文大學', '城市大學', '香港浸會大學', '恒生大學', '沙田廣場', '新城市廣場', '又一城', '好運中心', '中心廣場', '瀝源邨', '禾輋邨', '富豪花園', '銀禧花園', '仁安醫院', '威尔斯', '小沥源', '大涌橋道', '車公廟路', '沙田頭排', '沙田圍路', '大埔公路', '吐露港'],
  '大埔': ['Tai Po', 'Tai Po Town', '大埔墟', '科學園', '太和', '運頭塘', '大埔', '大埔墟站', '太和站', '大埔站', '大埔超級城', '大埔廣場', '運頭街', '運頭塘邨', '富雅花園', '聖公會阮王中學', '香港科學園', '白石角', '天賦海灣', '海日灣', '逸瓏灣', '嘉熙', '蔚然', '海鑽', '溋玥', 'University Park', '慈祐宮', '大埔醫院', '雅麗氏何妙齡那打素醫院'],
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
  const correctDistrict = r.district || getDistrictFromAddress(address)
  const types = r.types || []
  
  // Get the best primary type - prefer food-related types
  const foodTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food', 'food', 'meal_takeaway', 'meal_delivery']
  let primaryType = 'restaurant'
  for (const t of types) {
    if (foodTypes.includes(t)) {
      primaryType = t
      break
    }
  }
  
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
    allTypes: types, // Keep all types for filtering
    description: types.filter(t => !['food', 'restaurant', 'point_of_interest', 'establishment'].includes(t)).join(', ') || '',
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

// Load data from JSON file - only runs on client side
export const loadRestaurantData = async () => {
  // Skip if already loaded or if running on server (SSR/FastBoot)
  if (dataLoaded) {
    console.log(`[RestaurantData] Already loaded: ${ALL_RESTAURANTS.length} places`)
    return ALL_RESTAURANTS
  }
  
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    console.log('[RestaurantData] Skipping server-side load')
    return DEFAULT_RESTAURANTS
  }
  
  console.log('[RestaurantData] Loading data from ./data/hk_nearby_500.json...')
  
  // Import local restaurants dynamically
  let localRestaurants = []
  try {
    const localModule = await import('../data/localRestaurants')
    localRestaurants = (localModule.LOCAL_RESTAURANTS || []).map(r => ({
      ...r,
      allTypes: [r.type],
      isLocal: true
    }))
    console.log(`[RestaurantData] ✅ Loaded ${localRestaurants.length} local HK restaurants`)
  } catch (e) {
    console.error('[RestaurantData] ❌ Failed to load local restaurants:', e.message)
  }
  
  try {
    const response = await fetch('./data/hk_nearby_500.json')
    if (response.ok) {
      const data = await response.json()
      const googlePlaces = (data.places || []).map(transformRestaurant)
      // Merge: local restaurants first, then Google Places
      ALL_RESTAURANTS = [...localRestaurants, ...googlePlaces]
      dataLoaded = true
      console.log(`[RestaurantData] ✅ Loaded ${ALL_RESTAURANTS.length} places (${localRestaurants.length} local + ${googlePlaces.length} Google)`)
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
