// Restaurant QA Service - AI-powered restaurant search
// Uses the 857 real HK restaurants from Google Places

import { searchRestaurants, getRestaurantsByDistrict, getTopRatedRestaurants, getRestaurantsByType, getAllDistricts, ALL_RESTAURANTS } from './GooglePlacesDataService'

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

// Get restaurants near a location, sorted by distance
export const getRestaurantsNearLocationSorted = (lat, lng, radiusKm = 10) => {
  return ALL_RESTAURANTS
    .filter(r => {
      if (!r.lat || !r.lng) return false
      const distance = calculateDistance(lat, lng, r.lat, r.lng)
      return distance <= radiusKm
    })
    .map(r => ({
      ...r,
      distance: calculateDistance(lat, lng, r.lat, r.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
}




// Parse user query and find relevant restaurants
export const queryRestaurants = (query, userLat = null, userLng = null) => {
  const q = query.toLowerCase()
  
  // District search
  const districts = getAllDistricts()
  for (const d of districts) {
    if (q.includes(d) || q.includes(d.replace('區', ''))) {
      let results = getRestaurantsByDistrict(d)
      // Add distance if user location available
      if (userLat && userLng) {
        results = results.map(r => ({
          ...r,
          distance: calculateDistance(userLat, userLng, r.lat, r.lng)
        })).sort((a, b) => a.distance - b.distance)
      }
      return { type: 'district', district: d, results }
    }
  }
  
  // Cuisine/type search
  const cuisineKeywords = {
    '日本': ['Japanese', 'Sushi', 'Ramen', '拉麵', '日本料理'],
    '中': ['Chinese', 'Cantonese', '粵菜', '中菜'],
    '西': ['Western', 'French', 'Italian', '意大利', '法國'],
    '韓': ['Korean', '韓國', '烤肉'],
    '泰': ['Thai', '泰國'],
    '越': ['Vietnamese', '越南', 'Pho'],
    '印度': ['Indian', '印度'],
    '美': ['American', 'Burger', '漢堡'],
    '意大利': ['Italian', 'Pizza', '意大利', 'Pizza'],
    '法國': ['French', '法國'],
    '海鮮': ['Seafood', '海鮮'],
    '快餐': ['Fast food', '快餐'],
    '茶餐廳': ['Cha chaan teng', '茶餐廳'],
    '甜品': ['Dessert', '甜品', 'Cake'],
    '咖啡': ['Coffee', 'Cafe', '咖啡', 'Café'],
    '點心': ['Dim sum', '點心', 'yum cha'],
    '燒味': ['BBQ', '燒味', 'Roast'],
    '麵': ['Noodle', '麵', ' Mee'],
    '粥': ['Congee', 'Porridge', '粥'],
    '火鍋': ['Hotpot', '火鍋'],
  }
  
  for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
    if (keywords.some(k => q.includes(k.toLowerCase()))) {
      let results = searchRestaurants(cuisine)
      if (userLat && userLng) {
        results = results.map(r => ({
          ...r,
          distance: calculateDistance(userLat, userLng, r.lat, r.lng)
        })).sort((a, b) => a.distance - b.distance)
      }
      return { type: 'cuisine', cuisine, results }
    }
  }
  
  // Rating search
  if (q.includes('高分') || q.includes('好食') || q.includes('必試') || q.includes('米芝蓮')) {
    let results = getTopRatedRestaurants(20)
    if (userLat && userLng) {
      results = results.map(r => ({
        ...r,
        distance: calculateDistance(userLat, userLng, r.lat, r.lng)
      })).sort((a, b) => a.distance - b.distance)
    }
    return { type: 'top', results }
  }
  
  // Free / cheap
  if (q.includes('平') || q.includes('便宜') || q.includes('超值')) {
    let all = searchRestaurants('')
    let results = all.filter(r => r.priceLevel === 1 || r.priceLevel === 2).slice(0, 20)
    if (userLat && userLng) {
      results = results.map(r => ({
        ...r,
        distance: calculateDistance(userLat, userLng, r.lat, r.lng)
      })).sort((a, b) => a.distance - b.distance)
    }
    return { type: 'cheap', results }
  }
  
  // Default: general search
  let results = searchRestaurants(query)
  if (userLat && userLng) {
    results = results.map(r => ({
      ...r,
      distance: calculateDistance(userLat, userLng, r.lat, r.lng)
    })).sort((a, b) => a.distance - b.distance)
  }
  return { type: 'search', query, results }
}

// Format distance for display
const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(1)}km`
}

// Format response for AI
export const formatRestaurantResponse = (restaurant) => {
  const price = restaurant.priceLevel ? '$'.repeat(restaurant.priceLevel) : '?'
  const rating = restaurant.rating ? `⭐ ${restaurant.rating}分` : ''
  const distance = restaurant.distance ? ` 📍 ${formatDistance(restaurant.distance)}` : ''
  return `📍 ${restaurant.name}
   • 地區：${restaurant.district || '未知'}
   • 評分：${rating}
   • 價格：${price}
   • 地址：${restaurant.address || '未知'}${distance}`
}

export const formatResponseText = (queryResult) => {
  const { type, results } = queryResult
  
  if (results.length === 0) {
    return `未搵到符合「${queryResult.query || ''}」嘅餐廳 🤔`
  }
  
  let header = ''
  switch (type) {
    case 'district': header = `📍 ${queryResult.district}區餐廳（${results.length}間）`; break
    case 'cuisine': header = `🍜 ${queryResult.cuisine}餐廳（${results.length}間）`; break
    case 'top': header = `⭐ 高分餐廳精選（${results.length}間）`; break
    case 'cheap': header = `💰 平靚正餐廳（${results.length}間）`; break
    default: header = `🔍 搵到 ${results.length} 間餐廳`
  }
  
  const top5 = results.slice(0, 5)
  const list = top5.map((r, i) => {
    const price = r.priceLevel ? '$'.repeat(r.priceLevel) : ''
    const rating = r.rating ? `⭐ ${r.rating}` : ''
    const dist = r.distance ? ` 📍 ${formatDistance(r.distance)}` : ''
    return `${i + 1}. **${r.name}** ${rating} ${price}${dist}
   📌 ${r.address || r.district || '未知'}`
  }).join('\n\n')
  
  const more = results.length > 5 ? `\n\n...仲有 ${results.length - 5} 間，去「附近」頁面睇晒啦！` : ''
  
  return `${header}\n\n${list}${more}`
}

export default { queryRestaurants, formatRestaurantResponse, formatResponseText, calculateDistance, getRestaurantsNearLocationSorted }
