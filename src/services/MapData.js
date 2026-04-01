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
    // Europe sample data
    restaurants: [
      { id: 'eu_1', name: '倫敦博羅市場', type: 'restaurant', rating: 4.7, price: 0, lat: 51.5055, lng: -0.0870, category: 'places', description: '倫敦最古老食品市場' },
      { id: 'eu_2', name: '巴黎瑪黑區', type: 'restaurant', rating: 4.6, price: 0, lat: 48.8566, lng: 2.3522, category: 'places', description: '巴黎時尚餐飲區' },
      { id: 'eu_3', name: '羅馬特萊維噴泉', type: 'restaurant', rating: 4.5, price: 0, lat: 41.9009, lng: 12.4833, category: 'places', description: '羅馬著名許願池' },
    ],
    attractions: [
      { id: 'eu_10', name: '埃菲爾鐵塔', type: 'tourist_attraction', rating: 4.8, price: 250, lat: 48.8584, lng: 2.2945, category: 'places', description: '巴黎標誌性建築' },
      { id: 'eu_11', name: '白金漢宮', type: 'tourist_attraction', rating: 4.7, price: 300, lat: 51.5014, lng: -0.1419, category: 'places', description: '英國皇室宮殿' },
      { id: 'eu_12', name: '羅馬競技場', type: 'tourist_attraction', rating: 4.8, price: 160, lat: 41.8902, lng: 12.4922, category: 'places', description: '古羅馬鬥獸場' },
      { id: 'eu_13', name: '巴塞羅那聖家堂', type: 'tourist_attraction', rating: 4.9, price: 260, lat: 41.4036, lng: 2.1744, category: 'places', description: '高迪建築代表作' },
    ],
    shopping: [
      { id: 'eu_20', name: '倫敦牛津街', type: 'shopping_mall', rating: 4.6, price: 0, lat: 51.5154, lng: -0.1419, category: 'places', description: '倫敦購物天堂' },
      { id: 'eu_21', name: '巴黎香榭麗舍', type: 'shopping_mall', rating: 4.7, price: 0, lat: 48.8698, lng: 2.3078, category: 'places', description: '世界最美大道' },
    ]
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
  se_asia: {
    // Southeast Asia sample data
    restaurants: [
      { id: 'sea_1', name: '曼谷水上市場', type: 'restaurant', rating: 4.5, price: 0, lat: 13.7563, lng: 100.5018, category: 'places', description: '泰國特色水上市場' },
      { id: 'sea_2', name: '新加坡克拉碼頭', type: 'restaurant', rating: 4.7, price: 0, lat: 1.2903, lng: 103.8514, category: 'places', description: '新加坡夜生活勝地' },
      { id: 'sea_3', name: '吉隆坡阿羅街', type: 'restaurant', rating: 4.6, price: 0, lat: 3.1449, lng: 101.7086, category: 'places', description: '馬來西亞美食街' },
      { id: 'sea_4', name: '胡志明市范五老街', type: 'restaurant', rating: 4.4, price: 0, lat: 10.7679, lng: 106.6926, category: 'places', description: '越南胡志明市背包客區' },
    ],
    attractions: [
      { id: 'sea_10', name: '大皇宮', type: 'tourist_attraction', rating: 4.8, price: 500, lat: 13.7516, lng: 100.4924, category: 'places', description: '泰國曼谷皇宮' },
      { id: 'sea_11', name: '魚尾獅公園', type: 'tourist_attraction', rating: 4.7, price: 0, lat: 1.2864, lng: 103.8593, category: 'places', description: '新加坡標誌性地標' },
      { id: 'sea_12', name: '雙峰塔', type: 'tourist_attraction', rating: 4.8, price: 80, lat: 3.1577, lng: 101.7118, category: 'places', description: '馬來西亞吉隆坡地標' },
      { id: 'sea_13', name: '吳哥窟', type: 'tourist_attraction', rating: 4.9, price: 250, lat: 13.4125, lng: 103.8670, category: 'places', description: '柬埔寨世界文化遺產' },
    ],
    shopping: [
      { id: 'sea_20', name: '恰圖恰市場', type: 'shopping_mall', rating: 4.5, price: 0, lat: 13.7999, lng: 100.5500, category: 'places', description: '曼谷最大週末市集' },
      { id: 'sea_21', name: '烏節路', type: 'shopping_mall', rating: 4.6, price: 0, lat: 1.3048, lng: 103.8318, category: 'places', description: '新加坡購物天堂' },
    ]
  },
  china: {
    name: '大陸',
    flag: '🇨🇳',
    mapProvider: 'amap',
    searchProvider: 'china',
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
      { id: 'cn_1', name: '上海小籠包', type: 'restaurant', rating: 4.7, price: 80, lat: 31.2304, lng: 121.4737, category: 'restaurants', description: '地道上海菜' },
      { id: 'cn_2', name: '北京烤鴨', type: 'restaurant', rating: 4.8, price: 200, lat: 39.9163, lng: 116.3972, category: 'restaurants', description: '北京必食' },
      { id: 'cn_3', name: '川菜麻辣火鍋', type: 'restaurant', rating: 4.6, price: 150, lat: 30.5728, lng: 114.2792, category: 'restaurants', description: '正宗川味' },
      { id: 'cn_4', name: '粵式茶樓', type: 'restaurant', rating: 4.5, price: 100, lat: 23.1288, lng: 113.2588, category: 'restaurants', description: '傳統粵式点心' },
      { id: 'cn_5', name: '重慶火鍋', type: 'restaurant', rating: 4.7, price: 120, lat: 29.5630, lng: 106.5516, category: 'restaurants', description: '麻辣鮮香' },
      { id: 'cn_6', name: '蘇州松鼠桂魚', type: 'restaurant', rating: 4.8, price: 180, lat: 31.2989, lng: 120.5853, category: 'restaurants', description: '蘇幫菜代表作' },
    ],
    attractions: [
      { id: 'cn_10', name: '外灘夜景', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 31.2408, lng: 121.4903, category: 'places', description: '上海標誌夜景' },
      { id: 'cn_11', name: '故宮博物院', type: 'museum', rating: 4.9, price: 60, lat: 39.9163, lng: 116.3972, category: 'places', description: '北京必遊世界文化遺產' },
      { id: 'cn_12', name: '長城', type: 'tourist_attraction', rating: 4.8, price: 45, lat: 40.4319, lng: 116.5704, category: 'places', description: '世界七大奇蹟之一' },
      { id: 'cn_13', name: '田子坊', type: 'tourist_attraction', rating: 4.4, price: 0, lat: 31.2185, lng: 121.4715, category: 'places', description: '上海石庫門風情' },
      { id: 'cn_14', name: '豫園', type: 'tourist_attraction', rating: 4.5, price: 30, lat: 31.2277, lng: 121.4899, category: 'places', description: '江南古典園林' },
      { id: 'cn_15', name: '東方明珠', type: 'tourist_attraction', rating: 4.7, price: 180, lat: 31.2397, lng: 121.4998, category: 'places', description: '上海標誌建築' },
      { id: 'cn_16', name: '西湖', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 30.2469, lng: 120.1484, category: 'places', description: '杭州世界文化遺產' },
      { id: 'cn_17', name: '廣州塔', type: 'tourist_attraction', rating: 4.6, price: 150, lat: 23.1065, lng: 113.3189, category: 'places', description: '广州塔小蛮腰' },
    ],
    shopping: [
      { id: 'cn_20', name: '南京路步行街', type: 'shopping_mall', rating: 4.5, price: 0, lat: 31.2372, lng: 121.4855, category: 'places', description: '上海最繁華商業街' },
      { id: 'cn_21', name: '王府井大街', type: 'shopping_mall', rating: 4.4, price: 0, lat: 39.9096, lng: 116.4073, category: 'places', description: '北京著名商業街' },
      { id: 'cn_22', name: '春熙路', type: 'shopping_mall', rating: 4.6, price: 0, lat: 30.6587, lng: 104.0857, category: 'places', description: '成都春熙路太古里' },
    ]
  },
  taiwan: {
    // Taiwan sample data - comprehensive
    restaurants: [
      { id: 'tw_1', name: '士林夜市', type: 'night_market', rating: 4.7, price: 0, lat: 25.0880, lng: 121.5240, category: 'restaurants', description: '台灣最大夜市，超過500個攤位', address: '台北市士林區大東路' },
      { id: 'tw_2', name: '饒河街夜市', type: 'night_market', rating: 4.6, price: 0, lat: 25.0500, lng: 121.5778, category: 'restaurants', description: '百年歷史夜市，藥燉排骨聞名', address: '台北市松山區饒河街' },
      { id: 'tw_3', name: '寧夏夜市', type: 'night_market', rating: 4.8, price: 0, lat: 25.0550, lng: 121.5150, category: 'restaurants', description: '美食雲集，在地人最愛', address: '台北市大同區寧夏路' },
      { id: 'tw_4', name: '逢甲夜市', type: 'night_market', rating: 4.8, price: 0, lat: 24.1777, lng: 120.6456, category: 'restaurants', description: '台中最大夜市，創意美食多', address: '台中市西屯區逢甲路' },
      { id: 'tw_5', name: '鼎泰豐', type: 'restaurant', rating: 4.8, price: 300, lat: 25.0339, lng: 121.5619, category: 'restaurants', description: '米芝蓮推薦，小籠包世界聞名', address: '台北市大安區忠孝東路' },
      { id: 'tw_6', name: '欣葉台式料理', type: 'restaurant', rating: 4.7, price: 400, lat: 25.0350, lng: 121.5600, category: 'restaurants', description: '正宗台菜，宴會首選', address: '台北市中山區' },
      { id: 'tw_7', name: '上引水產', type: 'restaurant', rating: 4.6, price: 500, lat: 25.0370, lng: 121.5530, category: 'restaurants', description: '立吞壽司，新鮮海鮮', address: '台北市中山區濱江市場' },
    ],
    attractions: [
      { id: 'tw_10', name: '台北101', type: 'tourist_attraction', rating: 4.7, price: 600, lat: 25.0330, lng: 121.5654, category: 'places', description: '台灣最高建築，世界第九高', address: '台北市信義區' },
      { id: 'tw_11', name: '日月潭', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 23.8644, lng: 120.9110, category: 'places', description: '台灣最美湖泊，詩情畫意', address: '南投縣魚池鄉' },
      { id: 'tw_12', name: '九份老街', type: 'tourist_attraction', rating: 4.7, price: 0, lat: 25.1093, lng: 121.8444, category: 'places', description: '懷舊山城，千與千尋取景地', address: '新北市瑞芳區' },
      { id: 'tw_13', name: '太魯閣峽谷', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 24.1577, lng: 121.6054, category: 'places', description: '世界級峽谷景觀，大自然奇蹟', address: '花蓮縣秀林鄉' },
      { id: 'tw_14', name: '墾丁國家公園', type: 'tourist_attraction', rating: 4.7, price: 0, lat: 22.0034, lng: 120.7463, category: 'places', description: '台灣最南端，海天一色', address: '屏東縣恆春鎮' },
      { id: 'tw_15', name: '故宮博物院', type: 'museum', rating: 4.8, price: 350, lat: 25.1026, lng: 121.5486, category: 'places', description: '翠玉白菜、肉形石展出', address: '台北市士林區' },
      { id: 'tw_16', name: '鹿港老街', type: 'tourist_attraction', rating: 4.5, price: 0, lat: 24.0569, lng: 120.4348, category: 'places', description: '傳統閩南建築，古蹟巡禮', address: '彰化縣鹿港鎮' },
    ],
    shopping: [
      { id: 'tw_20', name: '西門町', type: 'shopping_mall', rating: 4.6, price: 0, lat: 25.0423, lng: 121.5076, category: 'places', description: '台北潮流聖地，年輕人聚集', address: '台北市萬華區' },
      { id: 'tw_21', name: '信義商圈', type: 'shopping_mall', rating: 4.7, price: 0, lat: 25.0358, lng: 121.5656, category: 'places', description: '台北時尚地標，百貨林立', address: '台北市信義區' },
      { id: 'tw_22', name: '東區', type: 'shopping_mall', rating: 4.5, price: 0, lat: 25.0450, lng: 121.5600, category: 'places', description: '精品時尚，高級餐廳', address: '台北市大安區' },
    ]
  },
  japan: {
    // Japan sample data - comprehensive
    restaurants: [
      { id: 'jp_1', name: '淺草寺', type: 'temple', rating: 4.7, price: 0, lat: 35.7147, lng: 139.7966, category: 'restaurants', description: '東京最古老寺院，千年古剎', address: '東京都淺草區淺草' },
      { id: 'jp_2', name: '新宿御苑', type: 'park', rating: 4.6, price: 0, lat: 35.6852, lng: 139.7100, category: 'restaurants', description: '日式庭園，櫻花勝地', address: '東京都新宿區內藤町' },
      { id: 'jp_3', name: '築地市場', type: 'market', rating: 4.9, price: 200, lat: 35.6654, lng: 139.7707, category: 'restaurants', description: '東京最大魚市場，金槍魚拍賣', address: '東京都中央區築地' },
      { id: 'jp_4', name: '大阪道頓堀', type: 'food_street', rating: 4.8, price: 150, lat: 34.6687, lng: 135.5011, category: 'restaurants', description: '大阪美食天堂，章魚小丸子', address: '大阪中央區道頓堀' },
      { id: 'jp_5', name: '京都祇園', type: 'traditional', rating: 4.7, price: 100, lat: 35.0036, lng: 135.7760, category: 'restaurants', description: '傳統京料理，藝伎文化', address: '京都東山區祇園' },
      { id: 'jp_6', name: '奈良美食街', type: 'traditional', rating: 4.5, price: 80, lat: 34.6686, lng: 135.8309, category: 'restaurants', description: '奈良特產柿葉壽司', address: '奈良市東向移動' },
      { id: 'jp_7', name: '博多運河城', type: 'mall', rating: 4.6, price: 120, lat: 33.5904, lng: 130.4116, category: 'restaurants', description: '博多拉麵發源地', address: '福岡縣博多區' },
    ],
    attractions: [
      { id: 'jp_10', name: '東京迪士尼', type: 'amusement_park', rating: 4.8, price: 8000, lat: 35.6329, lng: 139.8804, category: 'places', description: '亞洲最大迪士尼，奇妙夢幻', address: '千葉縣浦安市舞濱' },
      { id: 'jp_11', name: '富士山', type: 'nature', rating: 4.9, price: 0, lat: 35.3606, lng: 138.7274, category: 'places', description: '日本最高峰，世界文化遺產', address: '山梨/靜岡縣' },
      { id: 'jp_12', name: '淺草雷門', type: 'landmark', rating: 4.8, price: 0, lat: 35.7101, lng: 139.7967, category: 'places', description: '東京標誌性地標，大紅燈籠', address: '東京都淺草區' },
      { id: 'jp_13', name: '大阪城', type: 'castle', rating: 4.7, price: 0, lat: 34.6873, lng: 135.5261, category: 'places', description: '日本名城，豐臣秀吉遺址', address: '大阪中央區大阪城' },
      { id: 'jp_14', name: '京都金閣寺', type: 'temple', rating: 4.9, price: 0, lat: 35.0116, lng: 135.7290, category: 'places', description: '世界文化遺產，黃金禪寺', address: '京都區北區' },
      { id: 'jp_15', name: '東京塔', type: 'landmark', rating: 4.6, price: 1200, lat: 35.6586, lng: 139.7454, category: 'places', description: '東京鐵塔，夜景絕美', address: '東京都港區芝公園' },
      { id: 'jp_16', name: '嵐山竹林', type: 'nature', rating: 4.7, price: 0, lat: 35.0172, lng: 135.6718, category: 'places', description: '竹林隧道，京都絕景', address: '京都右京區嵐山' },
    ],
    shopping: [
      { id: 'jp_20', name: '新宿逛街', type: 'shopping', rating: 4.8, price: 0, lat: 35.6896, lng: 139.7006, category: 'places', description: '東京購物天堂，百貨雲集', address: '東京都新宿區新宿' },
      { id: 'jp_21', name: '心齋橋', type: 'shopping', rating: 4.7, price: 0, lat: 34.6734, lng: 135.5014, category: 'places', description: '大阪購物地標，時尚中心', address: '大阪中央區心齋橋' },
      { id: 'jp_22', name: '秋葉原', type: 'electronics', rating: 4.5, price: 0, lat: 35.7023, lng: 139.7745, category: 'places', description: '動漫/電子產品聖地', address: '東京都千代田區' },
    ]
  },
  korea: {
    restaurants: [
      { id: 'kr_1', name: '明洞美食街', type: 'restaurant', rating: 4.5, price: 0, lat: 37.5636, lng: 126.9869, category: 'restaurants', description: '首爾購物美食天堂' },
      { id: 'kr_2', name: '弘大小吃街', type: 'restaurant', rating: 4.6, price: 0, lat: 37.5563, lng: 126.9238, category: 'restaurants', description: '年輕人聚集地' },
      { id: 'kr_3', name: '東大门炸雞', type: 'restaurant', rating: 4.7, price: 150, lat: 37.5662, lng: 127.0056, category: 'restaurants', description: '韓國炸雞名店' },
      { id: 'kr_4', name: '廣藏市場', type: 'restaurant', rating: 4.6, price: 100, lat: 37.5662, lng: 127.0030, category: 'restaurants', description: '首爾傳統市場' },
    ],
    attractions: [
      { id: 'kr_10', name: '景福宮', type: 'tourist_attraction', rating: 4.6, price: 0, lat: 37.5796, lng: 126.9770, category: 'places', description: '朝鮮王宮' },
      { id: 'kr_11', name: 'N首爾塔', type: 'tourist_attraction', rating: 4.7, price: 12000, lat: 37.5512, lng: 126.9882, category: 'places', description: '首爾地標' },
      { id: 'kr_12', name: '北村韓屋村', type: 'tourist_attraction', rating: 4.8, price: 0, lat: 37.5825, lng: 126.9830, category: 'places', description: '傳統韓屋風情' },
      { id: 'kr_13', name: '南山谷韓屋村', type: 'tourist_attraction', rating: 4.5, price: 0, lat: 37.5547, lng: 126.9194, category: 'places', description: '傳統文化體驗' },
      { id: 'kr_14', name: '濟州島', type: 'tourist_attraction', rating: 4.9, price: 0, lat: 33.4996, lng: 126.5312, category: 'places', description: '韓國渡假勝地' },
    ],
    shopping: [
      { id: 'kr_20', name: '明洞購物街', type: 'shopping_mall', rating: 4.5, price: 0, lat: 37.5636, lng: 126.9869, category: 'places', description: '首爾購物天堂' },
      { id: 'kr_21', name: '江南COEX商場', type: 'shopping_mall', rating: 4.6, price: 0, lat: 37.5123, lng: 127.0550, category: 'places', description: '高級購物商場' },
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
