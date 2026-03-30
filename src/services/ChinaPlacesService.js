/**
 * Alternative Places Service for China Region
 * Supports: Meituan Open Platform, Baidu Places, OpenRice HK
 * 
 * NOTE: These APIs require registration and API keys:
 * - 美团开放平台: https://open.meituan.com/
 * - 百度地图: https://lbsyun.baidu.com/
 * - OpenRice: https://www.openrice.com/developer
 */

// API Configuration
const API_CONFIG = {
  // 美团开放平台 (Meituan Open Platform)
  meituan: {
    appId: import.meta.env.VITE_MEITUAN_APP_ID || '',
    appSecret: import.meta.env.VITE_MEITUAN_APP_SECRET || '',
    baseUrl: 'https://open.meituan.com/api'
  },
  
  // 百度地图 (Baidu Places)
  baidu: {
    apiKey: import.meta.env.VITE_BAIDU_API_KEY || '',
    baseUrl: 'https://api.map.baidu.com/place/v2'
  },
  
  // OpenRice Hong Kong
  openrice: {
    apiKey: import.meta.env.VITE_OPENRICE_API_KEY || '',
    baseUrl: 'https://www.openrice.com/api'
  }
}

// Status
let isConfigured = false

// Check if any API is configured
export const isChinaApiReady = () => {
  return API_CONFIG.baidu.apiKey || API_CONFIG.openrice.apiKey
}

// Fetch places from Baidu
export const searchBaiduPlaces = async (keyword, location, region = '香港') => {
  if (!API_CONFIG.baidu.apiKey) {
    console.log('⚠️ Baidu API key not configured')
    return []
  }
  
  try {
    // Convert region to Baidu city code
    const cityCode = getBaiduCityCode(region)
    
    const params = new URLSearchParams({
      query: keyword,
      location: `${location.lng},${location.lat}`,
      radius: 3000,
      output: 'json',
      ak: API_CONFIG.baidu.apiKey,
      page_size: 20
    })
    
    const response = await fetch(`${API_CONFIG.baidu.baseUrl}/search?${params}`)
    const data = await response.json()
    
    if (data.status === 0 && data.results) {
      return data.results.map(place => ({
        id: place.uid,
        name: place.name,
        lat: place.location.lat,
        lng: place.location.lng,
        address: place.address,
        category: mapBaiduCategory(place.detail_info?.tag || ''),
        rating: place.detail_info?.rating?.overall_rating || null,
        priceLevel: place.detail_info?.price_level,
        phone: place.telephone,
        description: place.detail_info?.tag || ''
      }))
    }
    
    return []
  } catch (error) {
    console.error('❌ Baidu Places error:', error)
    return []
  }
}

// Fetch places from OpenRice HK
export const searchOpenRice = async (keyword, region = 'hong_kong') => {
  if (!API_CONFIG.openrice.apiKey) {
    console.log('⚠️ OpenRice API key not configured')
    return getOpenRiceSampleData(keyword, region)
  }
  
  try {
    // OpenRice API call would go here
    // For now, return sample data
    return getOpenRiceSampleData(keyword, region)
  } catch (error) {
    console.error('❌ OpenRice error:', error)
    return getOpenRiceSampleData(keyword, region)
  }
}

// Sample data for China region (when no API key)
const SAMPLE_CHINA_DATA = {
  restaurants: [
    { id: 'cn_1', name: '外灘夜景', rating: 4.7, price: 0, lat: 31.2408, lng: 121.4903, category: 'places', description: '上海標誌夜景', address: '上海外灘' },
    { id: 'cn_2', name: '故宮博物院', rating: 4.9, price: 60, lat: 39.9163, lng: 116.3972, category: 'places', description: '北京必遊世界文化遺產', address: '北京故宮' },
    { id: 'cn_3', name: '長城', rating: 4.8, price: 45, lat: 40.4319, lng: 116.5704, category: 'places', description: '世界七大奇蹟之一', address: '北京延慶' },
    { id: 'cn_4', name: '南鑼鼓巷', rating: 4.6, price: 0, lat: 39.9339, lng: 116.4136, category: 'places', description: '北京老胡同風情', address: '北京東城' },
    { id: 'cn_5', name: '田子坊', rating: 4.4, price: 0, lat: 31.2185, lng: 121.4715, category: 'places', description: '上海石庫門風情', address: '上海黃浦' },
    { id: 'cn_6', name: '城隍廟小吃', rating: 4.5, price: 50, lat: 31.2304, lng: 121.4737, category: 'restaurants', description: '上海地道小吃', address: '上海黃浦' },
  ],
  places: [
    { id: 'cn_10', name: '豫園', rating: 4.5, price: 30, lat: 31.2277, lng: 121.4899, category: 'places', description: '江南古典園林', address: '上海黃浦' },
    { id: 'cn_11', name: '東方明珠', rating: 4.7, price: 180, lat: 31.2397, lng: 121.4998, category: 'places', description: '上海標誌建築', address: '上海浦東' },
    { id: 'cn_12', name: '廣州塔', rating: 4.6, price: 150, lat: 23.1065, lng: 113.3189, category: 'places', description: '广州塔小蛮腰', address: '广州天河' },
  ]
}

// Sample data for Taiwan region
const SAMPLE_TAIWAN_DATA = {
  restaurants: [
    { id: 'tw_1', name: '士林夜市', rating: 4.6, price: 0, lat: 25.0880, lng: 121.5240, category: 'places', description: '台灣最大夜市', address: '台北士林' },
    { id: 'tw_2', name: '饒河街夜市', rating: 4.5, price: 0, lat: 25.0500, lng: 121.5778, category: 'places', description: '百年歷史夜市', address: '台北松山' },
    { id: 'tw_3', name: '寧夏夜市', rating: 4.7, price: 0, lat: 25.0550, lng: 121.5150, category: 'places', description: '美食雲集夜市', address: '台北大同' },
  ],
  places: [
    { id: 'tw_10', name: '台北101', rating: 4.7, price: 600, lat: 25.0330, lng: 121.5654, category: 'places', description: '台灣最高建築', address: '台北信義' },
    { id: 'tw_11', name: '日月潭', rating: 4.8, price: 0, lat: 23.8644, lng: 120.9110, category: 'places', description: '台灣最美湖泊', address: '南投魚池' },
    { id: 'tw_12', name: '九份老街', rating: 4.6, price: 0, lat: 25.1093, lng: 121.8444, category: 'places', description: '懷舊山城老街', address: '新北瑞芳' },
  ]
}

// Sample data for Japan region
const SAMPLE_JAPAN_DATA = {
  restaurants: [
    { id: 'jp_1', name: '淺草寺', rating: 4.7, price: 0, lat: 35.7147, lng: 139.7966, category: 'places', description: '東京最古老寺院', address: '東京淺草' },
    { id: 'jp_2', name: '新宿御苑', rating: 4.6, price: 0, lat: 35.6852, lng: 139.7100, category: 'places', description: '日式庭園', address: '東京新宿' },
    { id: 'jp_3', name: '築地市場', rating: 4.8, price: 200, lat: 35.6654, lng: 139.7707, category: 'restaurants', description: '東京最大魚市場', address: '東京築地' },
  ],
  places: [
    { id: 'jp_10', name: '東京迪士尼', rating: 4.8, price: 800, lat: 35.6329, lng: 139.8804, category: 'places', description: '亞洲最大迪士尼', address: '東京千葉' },
    { id: 'jp_11', name: '晴空塔', rating: 4.7, price: 300, lat: 35.7101, lng: 139.8107, category: 'places', description: '東京新地標', address: '東京墨田' },
    { id: 'jp_12', name: '富士山', rating: 4.9, price: 0, lat: 35.3606, lng: 138.7274, category: 'places', description: '日本最高峰', address: '山梨/靜岡' },
  ]
}

// Sample data for Korea region
const SAMPLE_KOREA_DATA = {
  restaurants: [
    { id: 'kr_1', name: '明洞購物街', rating: 4.5, price: 0, lat: 37.5636, lng: 126.9869, category: 'places', description: '首爾購物天堂', address: '首爾中區' },
    { id: 'kr_2', name: '弘大娛樂區', rating: 4.6, price: 0, lat: 37.5563, lng: 126.9238, category: 'places', description: '年輕人聚集地', address: '首爾麻浦' },
    { id: 'kr_3', name: '東大門市場', rating: 4.4, price: 0, lat: 37.5662, lng: 127.0056, category: 'places', description: '批發購物天堂', address: '首爾中區' },
  ],
  places: [
    { id: 'kr_10', name: 'N首爾塔', rating: 4.7, price: 100, lat: 37.5512, lng: 126.9882, category: 'places', description: '首爾地標', address: '首爾龍山' },
    { id: 'kr_11', name: '景福宮', rating: 4.6, price: 0, lat: 37.5796, lng: 126.9770, category: 'places', description: '朝鮮王宮', address: '首爾鐘路' },
    { id: 'kr_12', name: '北村韓屋村', rating: 4.8, price: 0, lat: 37.5825, lng: 126.9830, category: 'places', description: '傳統韓屋風情', address: '首爾鐘路' },
  ]
}

// Get sample data for region
export const getSamplePlaces = (region = 'china') => {
  const data = {
    china: SAMPLE_CHINA_DATA,
    taiwan: SAMPLE_TAIWAN_DATA,
    japan: SAMPLE_JAPAN_DATA,
    korea: SAMPLE_KOREA_DATA
  }
  
  const regionData = data[region] || data.china
  const allPlaces = [...regionData.restaurants, ...regionData.places]
  
  return allPlaces.map(p => ({
    ...p,
    category: p.category === 'restaurants' ? 'restaurants' : 'places'
  }))
}

// Get OpenRice sample data
const getOpenRiceSampleData = (keyword, region) => {
  // Hong Kong OpenRice sample data
  const hkData = [
    { id: 'or_1', name: '九記牛腩', rating: 4.7, price: 58, lat: 22.3065, lng: 114.1707, category: 'restaurants', description: '米芝蓮推薦', address: '上環干諾道西21-24號' },
    { id: 'or_2', name: '一蘭拉麵', rating: 4.8, price: 108, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '正宗豚骨湯底', address: '尖沙咀棉登徑' },
    { id: 'or_3', name: '鼎泰豐', rating: 4.6, price: 80, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '小籠包名店', address: '銅鑼灣波斯富街' },
    { id: 'or_4', name: '華嫂冰室', rating: 4.5, price: 50, lat: 22.3165, lng: 114.1727, category: 'restaurants', description: '菠蘿油必試', address: '觀塘巧明街' },
  ]
  
  return hkData.filter(p => 
    p.name.toLowerCase().includes(keyword.toLowerCase()) ||
    p.description.toLowerCase().includes(keyword.toLowerCase())
  )
}

// Helper: Get Baidu city code
const getBaiduCityCode = (region) => {
  const cityMap = {
    '上海': 2,
    '北京': 1,
    '广州': 257,
    '深圳': 75,
    '杭州': 17,
    '成都': 75, // Actually different
    '武汉': 170,
    '西安': 264
  }
  return cityMap[region] || 1
}

// Helper: Map Baidu category
const mapBaiduCategory = (tag) => {
  const foodTags = ['美食', '餐厅', '小吃', '火锅', '烧烤', '日本料理', '韩国料理', '中餐', '西餐', '咖啡', '酒吧']
  if (foodTags.some(t => tag.includes(t))) return 'restaurants'
  return 'places'
}

// Search for recommendations in China region
export const searchChinaPlaces = async (region, timeContext, userLocation) => {
  console.log('🔍 searchChinaPlaces called:', { region, timeContext })
  
  // First try Baidu if configured
  if (API_CONFIG.baidu.apiKey && userLocation) {
    const keyword = getKeywordForTime(timeContext)
    const results = await searchBaiduPlaces(keyword, userLocation, region)
    if (results.length > 0) {
      console.log('✅ Baidu results:', results.length)
      return results
    }
  }
  
  // Fall back to sample data
  console.log('📍 Using sample data for China region')
  return getSamplePlaces(region)
}

// Get keyword based on time context
const getKeywordForTime = (timeContext) => {
  const keywords = {
    morning: '早餐 茶餐厅',
    noon: '午餐 餐厅',
    afternoon: '下午茶 咖啡',
    evening: '晚餐 餐厅',
    night: '夜宵 小吃'
  }
  return keywords[timeContext] || '餐厅'
}

// Export API config for setup
export const getApiSetupInfo = () => ({
  meituan: {
    name: '美团开放平台',
    url: 'https://open.meituan.com/',
    requires: ['企业认证', 'App ID', 'App Secret']
  },
  baidu: {
    name: '百度地图开放平台',
    url: 'https://lbsyun.baidu.com/',
    requires: ['个人/企业认证', 'API Key (免费)']
  },
  openrice: {
    name: 'OpenRice API',
    url: 'https://www.openrice.com/developer',
    requires: ['API Key', '申请审批']
  }
})
