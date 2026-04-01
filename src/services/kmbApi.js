// KMB API Service with Mock Data Fallback
const BASE_URL = 'https://data.etabus.gov.hk'

// Mock bus routes data (fallback)
const MOCK_ROUTES = [
  { route: '1', bound: 'O', orig_tc: '竹園邨', dest_tc: '尖沙咀碼頭', orig_en: 'Chuk Yuen Estate', dest_en: 'Star Ferry' },
  { route: '1A', bound: 'O', orig_tc: '竹園邨', dest_tc: '尖沙咀碼頭', orig_en: 'Chuk Yuen Estate', dest_en: 'Star Ferry' },
  { route: '2', bound: 'O', orig_tc: '蘇屋邨', dest_tc: '尖沙咀碼頭', orig_en: 'So Uk Estate', dest_en: 'Star Ferry' },
  { route: '5', bound: 'O', orig_tc: '富山邨', dest_tc: '銅鑼灣', orig_en: 'Fu Shan Estate', dest_en: 'Causeway Bay' },
  { route: '6', bound: 'O', orig_tc: '荔枝角', dest_tc: '中山廣場', orig_en: 'Lai Chi Kok', dest_en: ' Zhongshan Plaza' },
  { route: '8', bound: 'O', orig_tc: '青衣碼頭', dest_tc: '九龍站', orig_en: 'Tsing Yi Pier', dest_en: 'Kowloon Station' },
  { route: '11', bound: 'O', orig_tc: '九龍站', dest_tc: '堅尼地城', orig_en: 'Kowloon Station', dest_en: 'Kennedy Town' },
  { route: '13', bound: 'O', orig_tc: '土瓜灣', dest_tc: '中環', orig_en: 'To Kwa Wan', dest_en: 'Central' },
  { route: '14', bound: 'O', orig_tc: '長沙灣', dest_tc: '中環', orig_en: 'Cheung Sha Wan', dest_en: 'Central' },
  { route: '26', bound: 'O', orig_tc: '黃大仙', dest_tc: '尖沙咀', orig_en: 'Wong Tai Sin', dest_en: 'Tsim Sha Tsui' },
  { route: '30X', bound: 'O', orig_tc: '數碼港', dest_tc: '長沙灣', orig_en: 'Cyberport', dest_en: 'Cheung Sha Wan' },
  { route: '40', bound: 'O', orig_tc: '華富邨', dest_tc: '金鐘道', orig_en: 'Wah Fu Estate', dest_en: 'Queensway' },
  { route: '42', bound: 'O', orig_tc: '華富邨', dest_tc: '北角', orig_en: 'Wah Fu Estate', dest_en: 'North Point' },
  { route: '72', bound: 'O', orig_tc: '長沙灣', dest_tc: '金鐘', orig_en: 'Cheung Sha Wan', dest_en: 'Admiralty' },
  { route: '81', bound: 'O', orig_tc: '禾輋', dest_tc: '九龍站', orig_en: 'Wo Che Estate', dest_en: 'Kowloon Station' },
  { route: '91', bound: 'O', orig_tc: '清水灣', dest_tc: '尖沙咀碼頭', orig_en: 'Clear Water Bay', dest_en: 'Star Ferry' },
  { route: '96', bound: 'O', orig_tc: '利安邨', dest_tc: '牛池灣', orig_en: 'Lee On Estate', dest_en: 'Choi Hung' },
  { route: '98', bound: 'O', orig_tc: '將軍澳', dest_tc: '牛頭角', orig_en: 'Tseung Kwan O', dest_en: 'Ngau Tau Kok' },
  { route: '101', bound: 'O', orig_tc: '堅尼地城', dest_tc: '九龍', orig_en: 'Kennedy Town', dest_en: 'Kowloon' },
  { route: '104', bound: 'O', orig_tc: '白田', dest_tc: '中環', orig_en: 'Pak Tin', dest_en: 'Central' },
  { route: '113', bound: 'O', orig_tc: '彩虹', dest_tc: '中環', orig_en: 'Choi Hung', dest_en: 'Central' },
  { route: '182', bound: 'O', orig_tc: '愉翠苑', dest_tc: '中環', orig_en: 'Yu Chui Estate', dest_en: 'Central' },
  { route: '270A', bound: 'O', orig_tc: '粉嶺', dest_tc: '中環', orig_en: 'Fanling', dest_en: 'Central' },
  { route: '277X', bound: 'O', orig_tc: '粉嶺', dest_tc: '天后站', orig_en: 'Fanling', dest_en: 'Tin Hau Station' },
  { route: '281A', bound: 'O', orig_tc: '沙田', dest_tc: '九龍站', orig_en: 'Sha Tin', dest_en: 'Kowloon Station' },
  { route: '296D', bound: 'O', orig_tc: '將軍澳', dest_tc: '九龍塘', orig_en: 'Tseung Kwan O', dest_en: 'Kowloon Tong' },
  { route: '373', bound: 'O', orig_tc: '上水', dest_tc: '中環', orig_en: 'Sheung Shui', dest_en: 'Central' },
  { route: '930', bound: 'O', orig_tc: '荃灣西', dest_tc: '灣仔', orig_en: 'Tsuen Wan West', dest_en: 'Wan Chai' },
  { route: '978', bound: 'O', orig_tc: '粉嶺', dest_tc: '灣仔北', orig_en: 'Fanling', dest_en: 'Wan Chai North' },
  { route: 'A22', bound: 'O', orig_tc: '機場', dest_tc: '尖沙咀', orig_en: 'Airport', dest_en: 'Tsim Sha Tsui' },
]

// Cache for routes
let routesCache = null
let routesCacheTime = 0
const CACHE_DURATION = 60000

// Format ETA
export const formatETA = (etaString) => {
  if (!etaString) return '未知'
  try {
    const eta = new Date(etaString)
    const now = new Date()
    const diffMs = eta - now
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins <= 0) return '即將到站'
    if (diffMins < 60) return `${diffMins} 分鐘`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}小時${mins}分鐘`
  } catch {
    return '未知'
  }
}

// Get route list
export const getRouteList = async (query = '') => {
  try {
    const now = Date.now()
    if (routesCache && (now - routesCacheTime) < CACHE_DURATION) {
      const filtered = routesCache.filter(r => 
        r.route.toLowerCase().includes(query.toLowerCase())
      )
      return filtered.length > 0 ? filtered : MOCK_ROUTES.filter(r => 
        r.route.toLowerCase().includes(query.toLowerCase())
      )
    }

    const response = await fetch(`${BASE_URL}/v1/transport/kmb/route/`)
    if (!response.ok) throw new Error('API failed')
    
    const data = await response.json()
    routesCache = data.data || []
    routesCacheTime = now
    
    if (query) {
      const filtered = routesCache.filter(r => 
        r.route.toLowerCase().includes(query.toLowerCase())
      )
      return filtered.length > 0 ? filtered : MOCK_ROUTES.filter(r => 
        r.route.toLowerCase().includes(query.toLowerCase())
      )
    }
    return routesCache
  } catch (error) {
    console.warn('KMB API failed, using mock data:', error.message)
    if (query) {
      return MOCK_ROUTES.filter(r => 
        r.route.toLowerCase().includes(query.toLowerCase())
      )
    }
    return MOCK_ROUTES
  }
}

// Get stop list
export const getStopList = async () => {
  // Return mock stops for common routes
  return [
    { stop: '001', name_tc: '港鐵旺角站', name_en: 'MTR Mong Kok Station' },
    { stop: '002', name_tc: '港鐵太子站', name_en: 'MTR Prince Edward Station' },
    { stop: '003', name_tc: '港鐵油麻地站', name_en: 'MTR Yau Ma Tei Station' },
    { stop: '004', name_tc: '港鐵佐敦站', name_en: 'MTR Jordan Station' },
    { stop: '005', name_tc: '港鐵尖沙咀站', name_en: 'MTR Tsim Sha Tsui Station' },
    { stop: '006', name_tc: '港鐵中環站', name_en: 'MTR Central Station' },
    { stop: '007', name_tc: '港鐵金鐘站', name_en: 'MTR Admiralty Station' },
    { stop: '008', name_tc: '港鐵灣仔站', name_en: 'MTR Wan Chai Station' },
    { stop: '009', name_tc: '港鐵銅鑼灣站', name_en: 'MTR Causeway Bay Station' },
    { stop: '010', name_tc: '港鐵天后站', name_en: 'MTR Tin Hau Station' },
  ]
}

// Get route stop list
export const getRouteStopList = async (route, bound = 'O', serviceType = '1') => {
  // Return mock stops
  return Array.from({ length: 15 }, (_, i) => ({
    route,
    bound,
    seq: String(i + 1),
    stop: String(i + 1),
    name_tc: `車站 ${i + 1}`,
    name_en: `Stop ${i + 1}`,
    name_sc: `车站 ${i + 1}`
  }))
}

// Get stop ETA
export const getStopETA = async (stopId) => {
  try {
    const response = await fetch(`${BASE_URL}/v1/transport/kmb/eta/${stopId}`)
    if (!response.ok) throw new Error('ETA API failed')
    const data = await response.json()
    return data.data || generateMockETAs(stopId)
  } catch {
    return generateMockETAs(stopId)
  }
}

// Generate mock ETAs
function generateMockETAs(stopId) {
  const routes = ['1', '2', '5', '6', '8', '11']
  const directions = ['O', 'I']
  const dests = [
    { O: '尖沙咀碼頭', I: '竹園邨' },
    { O: '中環', I: '長沙灣' },
    { O: '金鐘', I: '華富邨' },
    { O: '九龍站', I: '青衣碼頭' },
    { O: '灣仔', I: '荃灣西' },
    { O: '天后站', I: '粉嶺' },
  ]
  
  return routes.map((route, i) => ({
    route,
    dir: directions[i % 2],
    dest_tc: dests[i % dests.length][directions[i % 2]],
    seq: '1',
    eta: new Date(Date.now() + (i * 5 + Math.random() * 10) * 60000).toISOString(),
    eta_seq: i + 1
  }))
}

// Get route ETA
export const getRouteETA = async (route, stopSeq) => {
  return generateMockETAs(route)
}

// Get route stop list (short version)
export const getRouteStops = async (route) => {
  return getRouteStopList(route)
}
