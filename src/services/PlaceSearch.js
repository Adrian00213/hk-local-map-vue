// Place Search Service - Hybrid Google Places + 大众点评
// Hong Kong, Taiwan, Japan, Korea, SE Asia, Europe → Google Places
// Mainland China → 大众点评 (Dianping)

// Google Places API Key
const GOOGLE_PLACES_API_KEY = 'AIzaSyA6VU14iA_ytRMWMxKbVvT_dWamaGeWAFE'
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place'

// 大众点评 API (需要申请，暂时用样本数据)
const DIANPING_API_KEY = 'YOUR_DIANPING_API_KEY' // 需要申请
const DIANPING_URL = 'https://api.dianping.com'

// Region to API mapping
export const SEARCH_CONFIG = {
  hong_kong: { provider: 'google', lang: 'zh-TW' },
  taiwan: { provider: 'google', lang: 'zh-TW' },
  japan: { provider: 'google', lang: 'ja' },
  korea: { provider: 'google', lang: 'ko' },
  se_asia: { provider: 'google', lang: 'en' },
  europe: { provider: 'google', lang: 'en' },
  global: { provider: 'google', lang: 'en' },
  china: { provider: 'dianping', lang: 'zh-CN' }
}

// Place type mapping for Google Places
export const PLACE_TYPES = {
  restaurant: ['restaurant', 'cafe', 'food', 'bakery', 'meal_delivery', 'meal_takeaway'],
  attractions: ['tourist_attraction', 'park', 'museum', 'art_gallery', 'amusement_park', 'zoo', 'aquarium', 'shopping_mall'],
  transport: ['transit_station', 'airport', 'bus_station', 'taxi_stand', 'train_station', 'subway_station'],
  shopping: ['shopping_mall', 'store', 'supermarket', 'convenience_store', 'clothing_store', 'shoe_store'],
  accommodation: ['hotel', 'lodging', 'hostel', 'motel', 'guest_house']
}

// Google Places Search
export const searchGooglePlaces = async (region, keyword, type = 'restaurant') => {
  const config = SEARCH_CONFIG[region] || SEARCH_CONFIG.hong_kong
  const types = PLACE_TYPES[type] || PLACE_TYPES.restaurant
  
  try {
    const url = `${GOOGLE_PLACES_URL}/textsearch/json`
    const params = new URLSearchParams({
      key: GOOGLE_PLACES_API_KEY,
      query: keyword,
      language: config.lang,
      types: types.join('|')
    })
    
    const response = await fetch(`${url}?${params}`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating || null,
        price_level: place.price_level,
        types: place.types,
        photos: place.photos ? place.photos.map(p => 
          `${GOOGLE_PLACES_URL}/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) : [],
        open_now: place.opening_hours?.open_now,
        provider: 'google',
        region: region
      }))
    }
    
    return []
  } catch (error) {
    console.error('Google Places API error:', error)
    return []
  }
}

// 大众点评 Search (需要 API Key)
export const searchDianping = async (city, keyword, type = '餐饮') => {
  try {
    // 注意：大众点评API需要企业认证，暂时返回空数组
    // 如有API Key，可按以下方式调用
    const response = await fetch(`${DIANPING_URL}/v1/businesses`, {
      headers: {
        'Authorization': `Bearer ${DIANPING_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        city: city,
        keyword: keyword,
        category: type
      }
    })
    
    const data = await response.json()
    return data.businesses || []
  } catch (error) {
    console.error('Dianping API error:', error)
    return []
  }
}

// Smart search based on region
export const smartSearchPlaces = async (region, keyword, options = {}) => {
  const { type = 'all', limit = 20 } = options
  const config = SEARCH_CONFIG[region] || SEARCH_CONFIG.hong_kong
  
  let results = []
  
  if (region === 'china') {
    // 大陆 - 使用样本数据 (因为大众点评 API需要企业认证)
    results = getSamplePlacesForChina(keyword, type)
  } else {
    // 其他地区 - Google Places
    const searchTypes = type === 'all' ? ['restaurant', 'tourist_attraction'] : [type]
    
    for (const t of searchTypes) {
      const places = await searchGooglePlaces(region, keyword, t)
      results = [...results, ...places]
    }
  }
  
  return results.slice(0, limit)
}

// 大陆样本数据 (在API对接前使用)
const getSamplePlacesForChina = (keyword, type) => {
  const allPlaces = [
    // 上海
    { name: '外灘', type: 'tourist_attraction', lat: 31.2408, lng: 121.4903, rating: 4.7, price: 0, city: '上海', category: 'places' },
    { name: '豫園', type: 'tourist_attraction', lat: 31.2277, lng: 121.4899, rating: 4.5, price: 30, city: '上海', category: 'places' },
    { name: '上海迪士尼', type: 'amusement_park', lat: 31.0655, lng: 121.5433, rating: 4.6, price: 399, city: '上海', category: 'places' },
    { name: '田子坊', type: 'tourist_attraction', lat: 31.2185, lng: 121.4715, rating: 4.4, price: 0, city: '上海', category: 'places' },
    { name: '海底撈火鍋', type: 'restaurant', lat: 31.2304, lng: 121.4737, rating: 4.6, price: 150, city: '上海', category: 'restaurants' },
    { name: '南翔饅頭店', type: 'restaurant', lat: 31.2277, lng: 121.4899, rating: 4.3, price: 50, city: '上海', category: 'restaurants' },
    
    // 北京
    { name: '故宮博物院', type: 'museum', lat: 39.9163, lng: 116.3972, rating: 4.9, price: 60, city: '北京', category: 'places' },
    { name: '長城', type: 'tourist_attraction', lat: 40.4319, lng: 116.5704, rating: 4.8, price: 45, city: '北京', category: 'places' },
    { name: '天安門廣場', type: 'tourist_attraction', lat: 39.9042, lng: 116.4074, rating: 4.7, price: 0, city: '北京', category: 'places' },
    { name: '798藝術區', type: 'tourist_attraction', lat: 39.9836, lng: 116.4945, rating: 4.5, price: 0, city: '北京', category: 'places' },
    { name: '北京烤鴨店', type: 'restaurant', lat: 39.9042, lng: 116.4074, rating: 4.7, price: 200, city: '北京', category: 'restaurants' },
    { name: '簋街小吃', type: 'restaurant', lat: 39.9385, lng: 116.4132, rating: 4.4, price: 80, city: '北京', category: 'restaurants' },
    
    // 深圳
    { name: '世界之窗', type: 'amusement_park', lat: 22.5382, lng: 113.9733, rating: 4.4, price: 200, city: '深圳', category: 'places' },
    { name: '東部華僑城', type: 'tourist_attraction', lat: 22.6196, lng: 114.2335, rating: 4.5, price: 150, city: '深圳', category: 'places' },
    { name: '深圳灣公園', type: 'park', lat: 22.4973, lng: 113.9546, rating: 4.6, price: 0, city: '深圳', category: 'places' },
    { name: '東門步行街', type: 'shopping_mall', lat: 22.3487, lng: 114.1297, rating: 4.3, price: 0, city: '深圳', category: 'places' },
    
    // 广州
    { name: '广州塔', type: 'tourist_attraction', lat: 23.1065, lng: 113.3189, rating: 4.5, price: 150, city: '广州', category: 'places' },
    { name: '白云山', type: 'park', lat: 23.1893, lng: 113.2645, rating: 4.6, price: 5, city: '广州', category: 'places' },
    { name: '北京路步行街', type: 'shopping_mall', lat: 23.1266, lng: 113.2654, rating: 4.4, price: 0, city: '广州', category: 'places' },
    { name: '陶陶居', type: 'restaurant', lat: 23.1266, lng: 113.2654, rating: 4.5, price: 100, city: '广州', category: 'restaurants' },
    
    // 成都
    { name: '大熊猫基地', type: 'zoo', lat: 30.7415, lng: 104.1433, rating: 4.7, price: 58, city: '成都', category: 'places' },
    { name: '宽窄巷子', type: 'tourist_attraction', lat: 30.6592, lng: 104.0563, rating: 4.6, price: 0, city: '成都', category: 'places' },
    { name: '锦里古街', type: 'tourist_attraction', lat: 30.6571, lng: 104.0570, rating: 4.5, price: 0, city: '成都', category: 'places' },
    { name: '武侯祠', type: 'tourist_attraction', lat: 30.6580, lng: 104.0572, rating: 4.4, price: 50, city: '成都', category: 'places' },
    
    // 重庆
    { name: '洪崖洞', type: 'tourist_attraction', lat: 29.5593, lng: 106.5828, rating: 4.6, price: 0, city: '重庆', category: 'places' },
    { name: '解放碑', type: 'shopping_mall', lat: 29.5589, lng: 106.5781, rating: 4.5, price: 0, city: '重庆', category: 'places' },
    { name: '长江索道', type: 'tourist_attraction', lat: 29.5535, lng: 106.5865, rating: 4.4, price: 20, city: '重庆', category: 'places' },
    
    // 杭州
    { name: '西湖', type: 'tourist_attraction', lat: 30.2467, lng: 120.1486, rating: 4.9, price: 0, city: '杭州', category: 'places' },
    { name: '靈隱寺', type: 'tourist_attraction', lat: 30.2371, lng: 120.0864, rating: 4.7, price: 75, city: '杭州', category: 'places' },
    { name: '宋城', type: 'amusement_park', lat: 30.1359, lng: 120.1361, rating: 4.5, price: 300, city: '杭州', category: 'places' },
    { name: '外婆家', type: 'restaurant', lat: 30.2467, lng: 120.1486, rating: 4.4, price: 60, city: '杭州', category: 'restaurants' }
  ]
  
  // Filter by keyword and type
  let filtered = allPlaces
  
  if (keyword) {
    filtered = filtered.filter(p => 
      p.name.includes(keyword) || p.city.includes(keyword)
    )
  }
  
  if (type !== 'all') {
    filtered = filtered.filter(p => {
      if (type === 'restaurants') return p.category === 'restaurants'
      if (type === 'places') return p.category === 'places'
      if (type === 'shopping') return p.type === 'shopping_mall'
      return true
    })
  }
  
  return filtered.map((p, i) => ({
    id: `cn_${i}`,
    ...p,
    provider: 'dianping',
    region: 'china'
  }))
}

// Get nearby places using Google Places
export const getNearbyGooglePlaces = async (lat, lng, radius = 1000, type = 'restaurant') => {
  try {
    const url = `${GOOGLE_PLACES_URL}/nearbysearch/json`
    const params = new URLSearchParams({
      key: GOOGLE_PLACES_API_KEY,
      location: `${lat},${lng}`,
      radius: radius,
      type: PLACE_TYPES[type]?.[0] || type
    })
    
    const response = await fetch(`${url}?${params}`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating || null,
        types: place.types,
        open_now: place.opening_hours?.open_now,
        provider: 'google'
      }))
    }
    
    return []
  } catch (error) {
    console.error('Google Places Nearby API error:', error)
    return []
  }
}
