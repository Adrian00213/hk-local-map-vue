// Restaurant Data Service - Local Mock Data
// Provides realistic Hong Kong restaurant data without external dependencies

// Popular Hong Kong restaurants with real coordinates
const HK_RESTAURANTS = [
  // Kowloon Area
  { name: "澳洲牛奶公司", cuisine: "港式", district: "佐敦", price: "$", rating: 4.5, lat: 22.3080, lng: 114.1714, address: "佐敦白加士街47號", type: "茶餐廳" },
  { name: "義順牛奶公司", cuisine: "港式", district: "佐敦", price: "$", rating: 4.3, lat: 22.3065, lng: 114.1720, address: "佐敦白加士街55號", type: "甜品" },
  { name: "九龍餐室", cuisine: "港式", district: "佐敦", price: "$$", rating: 4.2, lat: 22.3070, lng: 114.1700, address: "佐敦南京街30號", type: "茶餐廳" },
  { name: "一蘭拉麵", cuisine: "日式", district: "尖沙咀", price: "$$$", rating: 4.6, lat: 22.2950, lng: 114.1720, address: "尖沙咀棉登徑8號", type: "拉麵" },
  { name: "龍點心", cuisine: "港式", district: "旺角", price: "$$", rating: 4.4, lat: 22.3160, lng: 114.1720, address: "旺角窩打老道53號", type: "點心" },
  { name: "添好運", cuisine: "港式", district: "旺角", price: "$", rating: 4.5, lat: 22.3200, lng: 114.1690, address: "旺角廣華街2號", type: "點心" },
  { name: "港受人", cuisine: "港式", district: "旺角", price: "$", rating: 4.3, lat: 22.3180, lng: 114.1700, address: "旺角西洋菜街54號", type: "車仔麵" },
  { name: "勝記海鮮酒家", cuisine: "海鮮", district: "油麻地", price: "$$$", rating: 4.2, lat: 22.3120, lng: 114.1730, address: "油麻地上海街203號", type: "海鮮" },
  { name: "通達美食", cuisine: "港式", district: "油麻地", price: "$", rating: 4.1, lat: 22.3110, lng: 114.1750, address: "油麻地廟街265號", type: "小食" },
  { name: "新記冰室", cuisine: "港式", district: "太子", price: "$", rating: 4.2, lat: 22.3280, lng: 114.1680, address: "太子界限街37號", type: "冰室" },
  
  // Hong Kong Island
  { name: "檀島咖啡餅店", cuisine: "港式", district: "中環", price: "$", rating: 4.4, lat: 22.2800, lng: 114.1580, address: "中環士丹利街33號", type: "茶餐廳" },
  { name: "蘭芳園", cuisine: "港式", district: "中環", price: "$", rating: 4.5, lat: 22.2810, lng: 114.1590, address: "中環結志街2號", type: "茶餐廳" },
  { name: "鏞記酒家", cuisine: "粵菜", district: "中環", price: "$$$", rating: 4.3, lat: 22.2840, lng: 114.1560, address: "中環威靈頓街32號", type: "酒樓" },
  { name: "九記牛腩", cuisine: "港式", district: "中環", price: "$$", rating: 4.6, lat: 22.2830, lng: 114.1550, address: "中環歌賦街21號", type: "麵食" },
  { name: "勝香園", cuisine: "港式", district: "中環", price: "$", rating: 4.4, lat: 22.2830, lng: 114.1540, address: "中環美輪街2號", type: "大牌檔" },
  { name: "一樂燒鵝", cuisine: "港式", district: "中環", price: "$$$", rating: 4.7, lat: 22.2840, lng: 114.1570, address: "中環士丹頓街1號", type: "燒味" },
  { name: "沾仔記", cuisine: "雲吞麵", district: "中環", price: "$", rating: 4.5, lat: 22.2820, lng: 114.1580, address: "中環威靈頓街98號", type: "雲吞麵" },
  { name: "麥奀記", cuisine: "雲吞麵", district: "中環", price: "$$", rating: 4.4, lat: 22.2810, lng: 114.1590, address: "中環永吉街23號", type: "雲吞麵" },
  { name: "富記粥品", cuisine: "港式", district: "中環", price: "$", rating: 4.3, lat: 22.2800, lng: 114.1570, address: "中環機利文街53號", type: "粥品" },
  { name: "公利蔗汁", cuisine: "港式", district: "中環", price: "$", rating: 4.2, lat: 22.2810, lng: 114.1550, address: "中環荷李活道60號", type: "甜品" },
  
  // Wan Chai & Causeway Bay
  { name: "金光諸記", cuisine: "港式", district: "灣仔", price: "$", rating: 4.3, lat: 22.2770, lng: 114.1720, address: "灣仔大王東街12號", type: "茶餐廳" },
  { name: "華星冰室", cuisine: "港式", district: "灣仔", price: "$", rating: 4.4, lat: 22.2780, lng: 114.1740, address: "灣仔克街6號", type: "冰室" },
  { name: "再興燒臘飯店", cuisine: "港式", district: "灣仔", price: "$", rating: 4.5, lat: 22.2770, lng: 114.1750, address: "灣仔軒尼詩道265號", type: "燒味" },
  { name: "強記美食", cuisine: "港式", district: "灣仔", price: "$", rating: 4.2, lat: 22.2760, lng: 114.1730, address: "灣仔謝斐道415號", type: "小食" },
  { name: "渣哥兩溝三文治", cuisine: "港式", district: "灣仔", price: "$", rating: 4.1, lat: 22.2750, lng: 114.1740, address: "灣仔道132號", type: "小食" },
  { name: "新景園咖喱小廚", cuisine: "港式", district: "灣仔", price: "$", rating: 4.3, lat: 22.2770, lng: 114.1760, address: "灣仔廈門街17號", type: "咖喱" },
  { name: "文輝墨魚丸專賣店", cuisine: "港式", district: "銅鑼灣", price: "$", rating: 4.4, lat: 22.2790, lng: 114.1830, address: "銅鑼灣渣甸街22號", type: "麵食" },
  { name: "臭豆腐大王", cuisine: "港式", district: "銅鑼灣", price: "$", rating: 3.9, lat: 22.2800, lng: 114.1850, address: "銅鑼灣登龍街52號", type: "小食" },
  { name: "津味龍鬚糖", cuisine: "港式", district: "銅鑼灣", price: "$", rating: 4.1, lat: 22.2780, lng: 114.1840, address: "銅鑼灣謝斐道501號", type: "甜品" },
  
  // Sha Tin & New Territories
  { name: "明記牛奶甜品", cuisine: "港式", district: "沙田", price: "$", rating: 4.3, lat: 22.3820, lng: 114.1890, address: "沙田大圍積信街31號", type: "甜品" },
  { name: "美林邨冰室", cuisine: "港式", district: "沙田", price: "$", rating: 4.2, lat: 22.3850, lng: 114.1950, address: "沙田美林邨美林商場", type: "冰室" },
  { name: "陳根記", cuisine: "大排檔", district: "沙田", price: "$", rating: 4.5, lat: 22.3780, lng: 114.1880, address: "沙田大圍積福街72號", type: "大排檔" },
  { name: "車品品小食", cuisine: "港式", district: "沙田", price: "$", rating: 4.1, lat: 22.3800, lng: 114.1900, address: "沙田大圍村南道", type: "小食" },
  { name: "泉記糖水", cuisine: "港式", district: "大埔", price: "$", rating: 4.4, lat: 22.4450, lng: 114.1710, address: "大埔墟運頭街20號", type: "糖水" },
  { name: "亞婆豆腐花", cuisine: "港式", district: "大埔", price: "$", rating: 4.5, lat: 22.4500, lng: 114.1700, address: "大埔林村許林屋", type: "小食" },
  { name: "榮昌茶餐廳", cuisine: "港式", district: "元朗", price: "$", rating: 4.2, lat: 22.4420, lng: 114.0330, address: "元朗大棠路44號", type: "茶餐廳" },
  { name: "勝利牛丸王", cuisine: "越式", district: "元朗", price: "$", rating: 4.3, lat: 22.4450, lng: 114.0300, address: "元朗教育路1號", type: "粉麵" },
  { name: "佳記奶茶", cuisine: "港式", district: "元朗", price: "$", rating: 4.1, lat: 22.4430, lng: 114.0320, address: "元朗谷亭街17號", type: "茶餐廳" },
  { name: "天鴻燒鵝", cuisine: "粵菜", district: "元朗", price: "$$", rating: 4.4, lat: 22.4460, lng: 114.0350, address: "元朗元朗廣場", type: "燒味" },
  
  // Islands
  { name: "長洲平記", cuisine: "港式", district: "長洲", price: "$", rating: 4.5, lat: 22.2100, lng: 114.0280, address: "長洲新興街62號", type: "小食" },
  { name: "康記綠豆餅", cuisine: "港式", district: "長洲", price: "$", rating: 4.3, lat: 22.2090, lng: 114.0290, address: "長洲新興街107號", type: "小食" },
  { name: "清新冰室", cuisine: "港式", district: "長洲", price: "$", rating: 4.2, lat: 22.2110, lng: 114.0300, address: "長洲大興堤路", type: "冰室" },
  { name: "茶物語", cuisine: "港式", district: "南丫島", price: "$", rating: 4.4, lat: 22.2030, lng: 114.1120, address: "南丫島榕樹灣大街", type: "茶餐廳" },
  { name: "南島意式雪糕", cuisine: "西式", district: "南丫島", price: "$$", rating: 4.5, lat: 22.2020, lng: 114.1130, address: "南丫島榕樹灣廣場", type: "雪糕" },
  { name: "天虹海鮮酒家", cuisine: "海鮮", district: "南丫島", price: "$$$", rating: 4.6, lat: 22.2050, lng: 114.1300, address: "南丫島索罟灣第一街", type: "海鮮" },
  { name: "大澳勝利香蝦", cuisine: "港式", district: "大澳", price: "$", rating: 4.3, lat: 22.2550, lng: 113.8610, address: "大澳吉蔭街", type: "小食" },
  { name: "大澳餅家", cuisine: "港式", district: "大澳", price: "$", rating: 4.4, lat: 22.2540, lng: 113.8620, address: "大澳永安街", type: "小食" },
  
  // Popular Chains & Others
  { name: "麥當勞", cuisine: "快餐", district: "各區", price: "$", rating: 3.8, lat: 22.3000, lng: 114.1700, address: "各區分店", type: "快餐" },
  { name: "肯德基", cuisine: "快餐", district: "各區", price: "$", rating: 3.7, lat: 22.3010, lng: 114.1710, address: "各區分店", type: "快餐" },
  { name: "Pizza Hut", cuisine: "西式", district: "各區", price: "$$", rating: 3.9, lat: 22.3020, lng: 114.1720, address: "各區分店", type: "薄餅" },
  { name: "大家樂", cuisine: "港式", district: "各區", price: "$", rating: 3.8, lat: 22.3030, lng: 114.1730, address: "各區分店", type: "快餐" },
  { name: "大快活", cuisine: "港式", district: "各區", price: "$", rating: 3.9, lat: 22.3040, lng: 114.1740, address: "各區分店", type: "快餐" },
  { name: "美心MX", cuisine: "港式", district: "各區", price: "$", rating: 3.8, lat: 22.3050, lng: 114.1750, address: "各區分店", type: "快餐" },
  { name: "太興燒味", cuisine: "港式", district: "各區", price: "$", rating: 4.2, lat: 22.3060, lng: 114.1760, address: "各區分店", type: "燒味" },
  { name: "敏華冰室", cuisine: "港式", district: "各區", price: "$", rating: 4.3, lat: 22.3070, lng: 114.1770, address: "各區分店", type: "冰室" },
  { name: "翠華", cuisine: "港式", district: "各區", price: "$", rating: 4.1, lat: 22.3080, lng: 114.1780, address: "各區分店", type: "茶餐廳" },
  { name: "譚仔三哥", cuisine: "雲南", district: "各區", price: "$", rating: 4.4, lat: 22.3090, lng: 114.1790, address: "各區分店", type: "米線" },
  
  // Additional Popular Spots
  { name: "星座冰室", cuisine: "港式", district: "九龍城", price: "$", rating: 4.3, lat: 22.3370, lng: 114.1830, address: "九龍城侯王道45號", type: "冰室" },
  { name: "添好運 (深水埗)", cuisine: "港式", district: "深水埗", price: "$", rating: 4.5, lat: 22.3300, lng: 114.1650, address: "深水埗福華街115號", type: "點心" },
  { name: "新香園", cuisine: "港式", district: "深水埗", price: "$", rating: 4.2, lat: 22.3290, lng: 114.1640, address: "深水埗桂林街46號", type: "茶餐廳" },
  { name: "合益泰小食", cuisine: "港式", district: "深水埗", price: "$", rating: 4.6, lat: 22.3280, lng: 114.1620, address: "深水埗桂林街121號", type: "小食" },
  { name: "劉森記麵家", cuisine: "雲吞麵", district: "深水埗", price: "$", rating: 4.4, lat: 22.3270, lng: 114.1630, address: "深水埗福榮街62號", type: "雲吞麵" },
  { name: "八大常飯", cuisine: "日式", district: "葵芳", price: "$", rating: 4.2, lat: 22.3190, lng: 114.1320, address: "葵芳葵義路15號", type: "日式飯類" },
  { name: "新蘇記燒臘", cuisine: "港式", district: "荃灣", price: "$", rating: 4.3, lat: 22.3730, lng: 114.1120, address: "荃灣川龍街64號", type: "燒味" },
  { name: "祥榮茶餐廳", cuisine: "港式", district: "荃灣", price: "$", rating: 4.1, lat: 22.3720, lng: 114.1130, address: "荃灣兆和街", type: "茶餐廳" },
  { name: "拉麵Jo", cuisine: "日式", district: "將軍澳", price: "$$", rating: 4.5, lat: 22.3080, lng: 114.2600, address: "將軍澳PopCorn商場", type: "拉麵" },
  { name: "銀龍茶餐廳", cuisine: "港式", district: "將軍澳", price: "$", rating: 4.2, lat: 22.3100, lng: 114.2620, address: "將軍澳厚德邨", type: "茶餐廳" },
]

// Get all restaurants
export const getAllRestaurants = async () => {
  return HK_RESTAURANTS
}

// Get nearby restaurants based on user location
export const getNearbyRestaurants = async (lat, lng, radiusKm = 2) => {
  return HK_RESTAURANTS
    .map(r => ({
      ...r,
      distance: calculateDistance(lat, lng, r.lat, r.lng)
    }))
    .filter(r => r.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
}

// Calculate distance between two coordinates (Haversine formula)
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

// Get top rated restaurants
export const getTopRatedRestaurants = async (limit = 20) => {
  return [...HK_RESTAURANTS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// Get restaurants by cuisine
export const getRestaurantsByCuisine = async (cuisine) => {
  return HK_RESTAURANTS.filter(r => 
    r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
  )
}

// Get cuisine types
export const getCuisineTypes = async () => {
  const cuisines = [...new Set(HK_RESTAURANTS.map(r => r.cuisine))]
  return cuisines.sort()
}

// Format price range
export const formatPrice = (price) => {
  return price || '$'
}

// Get popularity score (mock)
export const getPopularityScore = (restaurant) => {
  return Math.floor(Math.random() * 50) + restaurant.rating * 10
}

// Initialize restaurants - loads data from Google Places JSON
export const initRestaurants = async () => {
  try {
    const module = await import('./GooglePlacesDataService')
    if (module.loadRestaurantData) {
      await module.loadRestaurantData()
    }
  } catch (e) {
    console.warn('[RestaurantApi] Failed to load GooglePlaces data:', e)
  }
  return true
}
