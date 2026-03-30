// Region detection and map configuration

export const REGIONS = {
  HK: 'hong_kong',      // Hong Kong, Macau, Taiwan
  CN: 'china',          // Mainland China
  GLOBAL: 'global'       // Other countries
}

// Map tile providers for different regions
export const MAP_CONFIG = {
  [REGIONS.HK]: {
    name: 'Google Maps',
    type: 'google',
    center: [22.3193, 114.1694],
    zoom: 14,
    tileUrl: null, // Uses Google Maps JS API
  },
  [REGIONS.CN]: {
    name: '高德地圖',
    type: 'amap',
    center: [31.2304, 121.4737],
    zoom: 12,
    // 高德/騰訊/OSM 混合圖層
    tileUrl: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    subdomains: [1, 2, 3, 4]
  },
  [REGIONS.GLOBAL]: {
    name: 'OpenStreetMap',
    type: 'osm',
    center: [22.3193, 114.1694],
    zoom: 14,
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  }
}

// Detect user region based on browser language and geolocation
export const detectRegion = () => {
  const lang = navigator.language || navigator.userLanguage || ''
  
  // Check for Mainland China
  if (lang.toLowerCase().includes('zh-cn') || 
      lang.toLowerCase().includes('zh_cn')) {
    return REGIONS.CN
  }
  
  // Check for Hong Kong / Macau / Taiwan
  if (lang.toLowerCase().includes('zh-hk') || 
      lang.toLowerCase().includes('zh-tw') ||
      lang.toLowerCase().includes('zh-mo')) {
    return REGIONS.HK
  }
  
  // Default to HK (most users will be HK)
  return REGIONS.HK
}

// Get map config for region
export const getMapConfig = (region = detectRegion()) => {
  return MAP_CONFIG[region] || MAP_CONFIG[REGIONS.HK]
}

// Place search providers by region
export const SEARCH_PROVIDERS = {
  [REGIONS.HK]: {
    name: 'Google Places',
    types: ['restaurant', 'cafe', 'food', 'tourist_attraction', 'point_of_interest', 'shopping_mall', 'park'],
    api: 'google_places'
  },
  [REGIONS.CN]: {
    name: '高德搜索',
    types: ['餐饮', '旅游景点', '商场', '公园', '酒店'],
    api: 'amap_place'
  },
  [REGIONS.GLOBAL]: {
    name: 'Google Places',
    types: ['restaurant', 'cafe', 'tourist_attraction', 'point_of_interest'],
    api: 'google_places'
  }
}

// Get search provider for region
export const getSearchProvider = (region = detectRegion()) => {
  return SEARCH_PROVIDERS[region] || SEARCH_PROVIDERS[REGIONS.HK]
}

// Sample places data for offline/demo use
export const SAMPLE_PLACES = {
  restaurants: {
    hong_kong: [
      { name: '九記牛腩', type: 'restaurant', rating: 4.7, price: 58, lat: 22.3065, lng: 114.1707, category: 'restaurants' },
      { name: '一蘭拉麵', type: 'restaurant', rating: 4.8, price: 108, lat: 22.2978, lng: 114.1690, category: 'restaurants' },
      { name: '鼎泰豐', type: 'restaurant', rating: 4.6, price: 80, lat: 22.2978, lng: 114.1690, category: 'restaurants' },
      { name: '華嫂冰室', type: 'restaurant', rating: 4.5, price: 50, lat: 22.3165, lng: 114.1727, category: 'restaurants' },
      { name: '翠華', type: 'restaurant', rating: 4.3, price: 48, lat: 22.3193, lng: 114.1694, category: 'restaurants' },
      { name: '麥當勞', type: 'restaurant', rating: 4.0, price: 25, lat: 22.3150, lng: 114.1700, category: 'restaurants' },
    ],
    china: [
      { name: '海底撈火鍋', type: 'restaurant', rating: 4.6, price: 150, lat: 31.2304, lng: 121.4737, category: 'restaurants' },
      { name: '鼎泰豐', type: 'restaurant', rating: 4.5, price: 60, lat: 31.2304, lng: 121.4737, category: 'restaurants' },
    ],
    global: []
  },
  attractions: {
    hong_kong: [
      { name: '山頂纜車', type: 'tourist_attraction', rating: 4.8, price: 88, lat: 22.2665, lng: 114.1570, category: 'places' },
      { name: '維多利亞港', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 22.2855, lng: 114.1617, category: 'places' },
      { name: '迪士尼樂園', type: 'theme_park', rating: 4.7, price: 639, lat: 22.3129, lng: 114.0414, category: 'places' },
      { name: '海洋公園', type: 'zoo', rating: 4.6, price: 480, lat: 22.2505, lng: 114.1802, category: 'places' },
      { name: 'M+博物館', type: 'museum', rating: 4.7, price: 0, lat: 22.2855, lng: 114.1617, category: 'places' },
      { name: '香港故宮博物館', type: 'museum', rating: 4.8, price: 120, lat: 22.2855, lng: 114.1617, category: 'places' },
    ],
    china: [
      { name: '故宮博物院', type: 'museum', rating: 4.9, price: 60, lat: 39.9163, lng: 116.3972, category: 'places' },
      { name: '長城', type: 'tourist_attraction', rating: 4.8, price: 45, lat: 40.4319, lng: 116.5704, category: 'places' },
      { name: '外灘', type: 'tourist_attraction', rating: 4.7, price: 0, lat: 31.2408, lng: 121.4903, category: 'places' },
    ],
    global: [
      { name: '東京迪士尼', type: 'theme_park', rating: 4.7, price: 8000, lat: 35.6329, lng: 139.8804, category: 'places' },
      { name: '埃菲爾鐵塔', type: 'tourist_attraction', rating: 4.8, price: 200, lat: 48.8584, lng: 2.2945, category: 'places' },
    ]
  },
  shopping: {
    hong_kong: [
      { name: '海港城', type: 'shopping_mall', rating: 4.6, price: 0, lat: 22.2955, lng: 114.1727, category: 'places' },
      { name: '又一城', type: 'shopping_mall', rating: 4.5, price: 0, lat: 22.3375, lng: 114.1657, category: 'places' },
      { name: '朗豪坊', type: 'shopping_mall', rating: 4.4, price: 0, lat: 22.3167, lng: 114.1727, category: 'places' },
    ],
    china: [
      { name: '上海IFC', type: 'shopping_mall', rating: 4.6, price: 0, lat: 31.2304, lng: 121.4737, category: 'places' },
    ],
    global: []
  }
}

// Get places by region and category
export const getPlaces = (region, category = 'all') => {
  const places = []
  
  if (category === 'all' || category === 'restaurants') {
    const restaurants = SAMPLE_PLACES.restaurants[region] || SAMPLE_PLACES.restaurants.hong_kong
    places.push(...restaurants)
  }
  
  if (category === 'all' || category === 'places') {
    const attractions = SAMPLE_PLACES.attractions[region] || SAMPLE_PLACES.attractions.hong_kong
    const shopping = SAMPLE_PLACES.shopping[region] || SAMPLE_PLACES.shopping.hong_kong
    places.push(...attractions, ...shopping)
  }
  
  return places
}
