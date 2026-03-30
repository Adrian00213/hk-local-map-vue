import { useState, useEffect, useCallback } from 'react'
import { Sparkles, TrendingUp, Clock, MapPin, Star, Heart, Gift, Zap, Brain, Sun, Cloud, RefreshCw } from 'lucide-react'
import { searchPlacesMultiType, getNearbyPlaces } from '../services/PlaceSearch'

// Fallback data for when API fails - comprehensive for all regions
const FALLBACK_DATA = {
  hong_kong: {
    restaurants: [
      { id: 'hk_1', name: '九記牛腩', rating: 4.7, price: 58, lat: 22.3065, lng: 114.1707, category: 'restaurants', description: '米芝蓮推薦，牛腩軟腍' },
      { id: 'hk_2', name: '一蘭拉麵', rating: 4.8, price: 108, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '正宗豚骨湯底' },
      { id: 'hk_3', name: '鼎泰豐', rating: 4.6, price: 80, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '小籠包名店' },
      { id: 'hk_4', name: '華嫂冰室', rating: 4.5, price: 50, lat: 22.3165, lng: 114.1727, category: 'restaurants', description: '菠蘿油必試' },
    ],
    places: [
      { id: 'hk_10', name: '山頂纜車', rating: 4.8, price: 88, lat: 22.2665, lng: 114.1570, category: 'places', description: '維港全景' },
      { id: 'hk_11', name: '維多利亞港', rating: 4.9, price: 0, lat: 22.2855, lng: 114.1617, category: 'places', description: '世界三大夜景' },
      { id: 'hk_12', name: '迪士尼樂園', rating: 4.7, price: 639, lat: 22.3129, lng: 114.0414, category: 'places', description: '奇妙夢幻國度' },
      { id: 'hk_13', name: 'M+博物館', rating: 4.7, price: 0, lat: 22.2855, lng: 114.1617, category: 'places', description: '當代視覺文化' },
    ]
  },
  taiwan: {
    restaurants: [
      { id: 'tw_1', name: '士林夜市', rating: 4.6, price: 0, lat: 25.0880, lng: 121.5240, category: 'restaurants', description: '台灣最大夜市' },
      { id: 'tw_2', name: '鼎泰豐', rating: 4.5, price: 80, lat: 25.0330, lng: 121.5654, category: 'restaurants', description: '小籠包名店' },
    ],
    places: [
      { id: 'tw_10', name: '台北101', rating: 4.7, price: 600, lat: 25.0330, lng: 121.5654, category: 'places', description: '台灣最高建築' },
      { id: 'tw_11', name: '日月潭', rating: 4.8, price: 0, lat: 23.8644, lng: 120.9110, category: 'places', description: '台灣最美湖泊' },
    ]
  },
  japan: {
    restaurants: [
      { id: 'jp_1', name: '一蘭拉麵', rating: 4.7, price: 1000, lat: 35.7147, lng: 139.7966, category: 'restaurants', description: '東京豚骨拉麵' },
    ],
    places: [
      { id: 'jp_10', name: '東京迪士尼', rating: 4.7, price: 8000, lat: 35.6329, lng: 139.8804, category: 'places', description: '亞洲最紅樂園' },
      { id: 'jp_11', name: '富士山', rating: 4.9, price: 0, lat: 35.3606, lng: 138.7274, category: 'places', description: '日本最高峰' },
    ]
  },
  korea: {
    restaurants: [
      { id: 'kr_1', name: '明洞美食', rating: 4.5, price: 15000, lat: 37.5665, lng: 126.9780, category: 'restaurants', description: '首爾美食天堂' },
    ],
    places: [
      { id: 'kr_10', name: '景福宮', rating: 4.6, price: 0, lat: 37.5786, lng: 126.9767, category: 'places', description: '朝鮮王宮' },
    ]
  },
  global: {
    restaurants: [
      { id: 'gl_1', name: '當地美食', rating: 4.5, price: 100, lat: 0, lng: 0, category: 'restaurants', description: '探索當地美食' },
    ],
    places: [
      { id: 'gl_10', name: '熱門景點', rating: 4.6, price: 0, lat: 0, lng: 0, category: 'places', description: '發掘精彩去處' },
    ]
  }
}

// Time-based recommendation prompts
const TIME_PROMPTS = {
  morning: '早餐 茶餐廳',
  noon: '午餐 餐廳',
  afternoon: '下午茶 café',
  evening: '晚餐 餐廳',
  night: '夜宵 小食'
}

// Get current time context
const getTimeContext = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

// Get weather icon
const getWeatherIcon = (condition) => {
  const icons = {
    sunny: <Sun className="w-5 h-5 text-amber-500" />,
    cloudy: <Cloud className="w-5 h-5 text-zinc-400" />,
  }
  return icons[condition] || <Sun className="w-5 h-5 text-amber-500" />
}

export default function SmartRecommendations({ places = [], region = 'hong_kong', userLocation = null, onPlaceSelect }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [weather] = useState({ condition: 'sunny', temp: 26 })
  const timeContext = getTimeContext()

  // Get fallback data for region
  const getFallbackData = (regionKey) => {
    return FALLBACK_DATA[regionKey] || FALLBACK_DATA.global
  }

  // Fetch recommendations based on time and location
  const fetchRecommendations = useCallback(async () => {
    setRefreshing(true)
    setUsingFallback(false)
    
    try {
      const results = []
      
      // Try API first
      const timePrompt = TIME_PROMPTS[timeContext]
      const timeBasedPlaces = await searchPlacesMultiType(region, timePrompt, { limit: 5 })
      
      if (timeBasedPlaces.length > 0) {
        // API returned results
        results.push({
          type: 'time',
          title: timeContext === 'morning' ? '🌅 朝早精選' :
                 timeContext === 'noon' ? '☀️ 午餐精選' :
                 timeContext === 'afternoon' ? '🌤️ 下午茶精選' :
                 timeContext === 'evening' ? '🌆 晚餐精選' : '🌙 夜宵精選',
          places: timeBasedPlaces.slice(0, 3),
          icon: timeContext === 'morning' ? '🌅' : timeContext === 'noon' ? '☀️' :
                timeContext === 'afternoon' ? '🌤️' : timeContext === 'evening' ? '🌆' : '🌙',
          source: '🔍 Google 實時數據'
        })
        
        // Trending
        const trendingPlaces = await searchPlacesMultiType(region, '熱門 景點', { limit: 3 })
        if (trendingPlaces.length > 0) {
          results.push({
            type: 'trending',
            title: '🔥 熱門精選',
            places: trendingPlaces.slice(0, 3),
            icon: '🔥',
            source: '🔍 Google 實時數據'
          })
        }
      } else {
        // API returned empty - use fallback
        throw new Error('Empty results')
      }
      
      setRecommendations(results)
    } catch (error) {
      console.log('Using fallback data:', error.message)
      setUsingFallback(true)
      
      // Use fallback data
      const fallback = getFallbackData(region)
      
      const results = []
      
      // Time-based with fallback
      const timePlaces = fallback.restaurants || []
      results.push({
        type: 'time',
        title: timeContext === 'morning' ? '🌅 朝早精選' :
               timeContext === 'noon' ? '☀️ 午餐精選' :
               timeContext === 'afternoon' ? '🌤️ 下午茶精選' :
               timeContext === 'evening' ? '🌆 晚餐精選' : '🌙 夜宵精選',
        places: timePlaces.slice(0, 3),
        icon: timeContext === 'morning' ? '🌅' : timeContext === 'noon' ? '☀️' :
              timeContext === 'afternoon' ? '🌤️' : timeContext === 'evening' ? '🌆' : '🌙',
        source: '📍 樣本數據'
      })
      
      // Attractions with fallback
      const attractionPlaces = fallback.places || []
      if (attractionPlaces.length > 0) {
        results.push({
          type: 'places',
          title: '🎯 必去景點',
          places: attractionPlaces.slice(0, 3),
          icon: '🎯',
          source: '📍 樣本數據'
        })
      }
      
      setRecommendations(results)
    }
    
    setLoading(false)
    setRefreshing(false)
  }, [region, timeContext])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const handleRefresh = () => {
    fetchRecommendations()
  }

  const PlaceCard = ({ place }) => (
    <div 
      onClick={() => onPlaceSelect?.(place)}
      className="bg-white/80 backdrop-blur rounded-xl p-3 border border-zinc-100/50 cursor-pointer hover:bg-white transition-all active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-lg shrink-0">
          {place.category === 'restaurants' ? '🍜' : '🎯'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-900 text-sm truncate">{place.name}</p>
          {place.rating && (
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400" />
              {place.rating}
            </p>
          )}
          {place.price !== undefined && place.price > 0 && (
            <p className="text-xs text-zinc-500 mt-0.5">${place.price}</p>
          )}
          {place.description && (
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{place.description}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Weather Widget */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="text-2xl font-bold">{weather.temp}°C</div>
                <div className="text-sm opacity-80">香港</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/60 rounded-xl p-3 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-200" />
                <div className="flex-1">
                  <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-amber-200/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-2xl font-bold">{weather.temp}°C</div>
              <div className="text-sm opacity-80">香港 • {timeContext === 'morning' ? '朝早好時光' : timeContext === 'noon' ? '午飯時間' : timeContext === 'afternoon' ? '下午悠閒' : timeContext === 'evening' ? '晚間時光' : '夜喇'}</div>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Context */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-3 border border-violet-100/50">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-500" />
          <span className="text-sm text-violet-700 font-medium">
            🧠 為你根據時間同位置智能推薦 {usingFallback && '（離線模式）'}
          </span>
        </div>
      </div>

      {/* Recommendation Sections */}
      {recommendations.map((section, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{section.icon}</span>
              <h3 className="font-bold text-zinc-900">{section.title}</h3>
            </div>
            <span className="text-xs text-zinc-400">{section.source || ''}</span>
          </div>
          <div className="space-y-2">
            {section.places.map((place, pIdx) => (
              <PlaceCard key={pIdx} place={place} />
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {recommendations.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-500 text-sm">暫時冇推薦</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-amber-600 text-sm font-medium hover:underline"
          >
            重新整理
          </button>
        </div>
      )}
    </div>
  )
}
