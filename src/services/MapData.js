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

// Region details for UI
export const REGION_DETAILS = {
  hong_kong: {
    name: '香港',
    flag: '🇭🇰',
    mapProvider: 'google',
    searchProvider: 'google',
    sampleCity: 'Hong Kong',
    zoom: 14,
    center: [22.3193, 114.1694]
  },
  taiwan: {
    name: '台灣',
    flag: '🇹🇼',
    mapProvider: 'google',
    searchProvider: 'google',
    sampleCity: 'Taipei',
    zoom: 13,
    center: [25.0330, 121.5654]
  },
  japan: {
    name: '日本',
    flag: '🇯🇵',
    mapProvider: 'google',
    searchProvider: 'google',
    sampleCity: 'Tokyo',
    zoom: 13,
    center: [35.6762, 139.6503]
  },
  korea: {
    name: '韓國',
    flag: '🇰🇷',
    mapProvider: 'google',
    searchProvider: 'google',
    sampleCity: 'Seoul',
    zoom: 13,
    center: [37.5665, 126.9780]
  },
  se_asia: {
    name: '東南亞',
    flag: '🌴',
    mapProvider: 'google',
    searchProvider: 'google',
    sampleCity: 'Bangkok',
    zoom: 12,
    center: [13.7563, 100.5018]
  },
  europe: {
    name: '歐洲',
    flag: '🇪🇺',
    mapProvider: 'osm',
    searchProvider: 'google',
    sampleCity: 'Paris',
    zoom: 13,
    center: [48.8566, 2.3522]
  },
  global: {
    name: '全球',
    flag: '🌏',
    mapProvider: 'google',
    searchProvider: 'google',
    sampleCity: 'Hong Kong',
    zoom: 14,
    center: [22.3193, 114.1694]
  },
  china: {
    name: '大陸',
    flag: '🇨🇳',
    mapProvider: 'amap',
    searchProvider: 'dianping',
    sampleCity: '上海',
    zoom: 12,
    center: [31.2304, 121.4737]
  }
}

// Detect user region based on browser language
export const detectRegion = () => {
  const lang = navigator.language || navigator.userLanguage || ''
  
  if (lang.toLowerCase().includes('zh-cn') || lang.toLowerCase().includes('zh_cn')) {
    return 'china'
  }
  
  if (lang.toLowerCase().includes('zh-hk') || lang.toLowerCase().includes('zh-tw') || lang.toLowerCase().includes('zh-mo')) {
    return 'hong_kong'
  }
  
  if (lang.toLowerCase().includes('ja')) {
    return 'japan'
  }
  
  if (lang.toLowerCase().includes('ko')) {
    return 'korea'
  }
  
  // Default to Hong Kong
  return 'hong_kong'
}

// Get region details
export const getRegionDetails = (region) => {
  return REGION_DETAILS[region] || REGION_DETAILS.hong_kong
}

// Sample places data by region
export const SAMPLE_PLACES = {
  hong_kong: {
    restaurants: [
      { id: 'hk_1', name: '九記牛腩', type: 'restaurant', rating: 4.7, price: 58, lat: 22.3065, lng: 114.1707, category: 'restaurants', description: '米芝蓮推薦，牛腩軟腍' },
      { id: 'hk_2', name: '一蘭拉麵', type: 'restaurant', rating: 4.8, price: 108, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '正宗豚骨湯底' },
      { id: 'hk_3', name: '鼎泰豐', type: 'restaurant', rating: 4.6, price: 80, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '小籠包名店' },
      { id: 'hk_4', name: '華嫂冰室', type: 'restaurant', rating: 4.5, price: 50, lat: 22.3165, lng: 114.1727, category: 'restaurants', description: '菠蘿油必試' },
      { id: 'hk_5', name: '翠華', type: 'restaurant', rating: 4.3, price: 48, lat: 22.3193, lng: 114.1694, category: 'restaurants', description: '茶餐廳連鎖' },
      { id: 'hk_6', name: '蘭芳園', type: 'restaurant', rating: 4.4, price: 45, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '絲襪奶茶始祖' },
    ],
    attractions: [
      { id: 'hk_10', name: '山頂纜車', type: 'tourist_attraction', rating: 4.8, price: 88, lat: 22.2665, lng: 114.1570, category: 'places', description: '維港全景' },
      { id: 'hk_11', name: '維多利亞港', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 22.2855, lng: 114.1617, category: 'places', description: '世界三大夜景' },
      { id: 'hk_12', name: '迪士尼樂園', type: 'amusement_park', rating: 4.7, price: 639, lat: 22.3129, lng: 114.0414, category: 'places', description: '奇妙夢幻國度' },
      { id: 'hk_13', name: '海洋公園', type: 'zoo', rating: 4.6, price: 480, lat: 22.2505, lng: 114.1802, category: 'places', description: '熊貓館+機動遊戲' },
      { id: 'hk_14', name: 'M+博物館', type: 'museum', rating: 4.7, price: 0, lat: 22.2855, lng: 114.1617, category: 'places', description: '當代視覺文化' },
      { id: 'hk_15', name: '香港故宮博物館', type: 'museum', rating: 4.8, price: 120, lat: 22.2855, lng: 114.1617, category: 'places', description: '北京故宮珍藏' },
    ],
    shopping: [
      { id: 'hk_20', name: '海港城', type: 'shopping_mall', rating: 4.6, price: 0, lat: 22.2955, lng: 114.1727, category: 'places', description: '香港最大商場' },
      { id: 'hk_21', name: '又一城', type: 'shopping_mall', rating: 4.5, price: 0, lat: 22.3375, lng: 114.1657, category: 'places', description: 'Apple Store' },
      { id: 'hk_22', name: '朗豪坊', type: 'shopping_mall', rating: 4.4, price: 0, lat: 22.3167, lng: 114.1727, category: 'places', description: '旺角地標' },
    ]
  },
  china: {
    // Sample data for mainland China (full data comes from 大众点评 API)
    restaurants: [
      { id: 'cn_1', name: '外灘夜景', type: 'tourist_attraction', rating: 4.7, price: 0, lat: 31.2408, lng: 121.4903, category: 'places', description: '上海標誌夜景' },
      { id: 'cn_2', name: '故宮博物院', type: 'museum', rating: 4.9, price: 60, lat: 39.9163, lng: 116.3972, category: 'places', description: '北京必遊' },
      { id: 'cn_3', name: '長城', type: 'tourist_attraction', rating: 4.8, price: 45, lat: 40.4319, lng: 116.5704, category: 'places', description: '世界七大奇蹟' },
    ],
    attractions: [
      { id: 'cn_10', name: '田子坊', type: 'tourist_attraction', rating: 4.4, price: 0, lat: 31.2185, lng: 121.4715, category: 'places', description: '上海石庫門風情' },
      { id: 'cn_11', name: '豫園', type: 'tourist_attraction', rating: 4.5, price: 30, lat: 31.2277, lng: 121.4899, category: 'places', description: '江南古典園林' },
    ]
  },
  taiwan: {
    restaurants: [
      { id: 'tw_1', name: '士林夜市', type: 'tourist_attraction', rating: 4.6, price: 0, lat: 25.0880, lng: 121.5240, category: 'places', description: '台灣最大夜市' },
      { id: 'tw_2', name: '饒河街夜市', type: 'tourist_attraction', rating: 4.5, price: 0, lat: 25.0500, lng: 121.5778, category: 'places', description: '百年歷史夜市' },
    ],
    attractions: [
      { id: 'tw_10', name: '台北101', type: 'tourist_attraction', rating: 4.7, price: 600, lat: 25.0330, lng: 121.5654, category: 'places', description: '台灣最高建築' },
      { id: 'tw_11', name: '日月潭', type: 'tourist_attraction', rating: 4.8, price: 0, lat: 23.8644, lng: 120.9110, category: 'places', description: '台灣最美湖泊' },
    ]
  },
  japan: {
    restaurants: [
      { id: 'jp_1', name: '淺草寺', type: 'tourist_attraction', rating: 4.7, price: 0, lat: 35.7147, lng: 139.7966, category: 'places', description: '東京最古老寺院' },
      { id: 'jp_2', name: '新宿御苑', type: 'park', rating: 4.6, price: 0, lat: 35.6852, lng: 139.7100, category: 'places', description: '日式庭園' },
    ],
    attractions: [
      { id: 'jp_10', name: '東京迪士尼', type: 'amusement_park', rating: 4.7, price: 8000, lat: 35.6329, lng: 139.8804, category: 'places', description: '亞洲最紅樂園' },
      { id: 'jp_11', name: '富士山', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 35.3606, lng: 138.7274, category: 'places', description: '日本最高峰' },
    ]
  },
  korea: {
    restaurants: [
      { id: 'kr_1', name: '明洞', type: 'shopping_mall', rating: 4.5, price: 0, lat: 37.5665, lng: 126.9780, category: 'places', description: '首爾購物天堂' },
    ],
    attractions: [
      { id: 'kr_10', name: '景福宮', type: 'tourist_attraction', rating: 4.6, price: 0, lat: 37.5786, lng: 126.9767, category: 'places', description: '朝鮮王宮' },
      { id: 'kr_11', name: '南山首爾塔', type: 'tourist_attraction', rating: 4.5, price: 12000, lat: 37.5511, lng: 126.9882, category: 'places', description: '首爾地標' },
    ]
  }
}

// Get places for a region
export const getPlaces = (region, category = 'all') => {
  const regionData = SAMPLE_PLACES[region] || SAMPLE_PLACES.hong_kong
  let places = []
  
  if (category === 'all') {
    Object.values(regionData).forEach(cat => {
      places = [...places, ...cat]
    })
  } else if (category === 'restaurants') {
    places = regionData.restaurants || []
  } else if (category === 'places') {
    places = [...(regionData.attractions || []), ...(regionData.shopping || [])]
  } else {
    places = regionData[category] || []
  }
  
  return places
}
