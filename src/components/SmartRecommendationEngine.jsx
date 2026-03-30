import { useState, useEffect, useCallback } from 'react'
import { Sparkles, TrendingUp, Clock, MapPin, Star, Heart, Gift, Zap, Brain, Sun, Cloud, RefreshCw } from 'lucide-react'
import { searchForRecommendations } from '../services/GooglePlacesService'

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
    ]
  }
}

// Time-based recommendation prompts
const TIME_PROMPTS = {
  morning: 'morning',
  noon: 'noon',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
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

export default function SmartRecommendations({ places = [], region = 'hong_kong', userLocation = null, mapReady = false, onPlaceSelect }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [usingGoogle, setUsingGoogle] = useState(false)
  const [weather] = useState({ condition: 'sunny', temp: 26 })
  const timeContext = getTimeContext()

  // Fetch recommendations based on time and location
  const fetchRecommendations = useCallback(async () => {
    setRefreshing(true)
    console.log('🤖 SmartRecommendations fetching...', { region, timeContext, hasLocation: !!userLocation, mapReady })
    
    try {
      // Try Google Places Service first (if map is ready)
      if (mapReady && userLocation) {
        console.log('🔍 Using Google Maps Places API...')
        const results = await searchForRecommendations(region, timeContext, userLocation)
        
        if (results.length > 0) {
          console.log('✅ Google Places found:', results.length)
          setUsingGoogle(true)
          
          const sections = [
            {
              type: 'google',
              title: getTimeTitle(timeContext),
              places: results.slice(0, 3),
              icon: getTimeIcon(timeContext),
              source: '🔍 Google Maps 實時數據'
            },
            {
              type: 'trending',
              title: '🔥 熱門精選',
              places: results.slice(3, 6),
              icon: '🔥',
              source: '🔍 Google Maps 實時數據'
            }
          ]
          
          setRecommendations(sections.filter(s => s.places.length > 0))
          setLoading(false)
          setRefreshing(false)
          return
        }
      }
      
      // Fall back to sample data
      throw new Error('Google Places not available')
      
    } catch (error) {
      console.log('⚠️ Using fallback data:', error.message)
      setUsingGoogle(false)
      
      // Use fallback data
      const fallback = FALLBACK_DATA[region] || FALLBACK_DATA.hong_kong
      
      const sections = [
        {
          type: 'time',
          title: getTimeTitle(timeContext),
          places: fallback.restaurants.slice(0, 3),
          icon: getTimeIcon(timeContext),
          source: '📍 樣本數據'
        },
        {
          type: 'places',
          title: '🎯 必去景點',
          places: fallback.places.slice(0, 3),
          icon: '🎯',
          source: '📍 樣本數據'
        }
      ]
      
      setRecommendations(sections)
    }
    
    setLoading(false)
    setRefreshing(false)
  }, [region, timeContext, userLocation, mapReady])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const handleRefresh = () => {
    fetchRecommendations()
  }

  const getTimeTitle = (ctx) => {
    if (ctx === 'morning') return '🌅 朝早精選'
    if (ctx === 'noon') return '☀️ 午餐精選'
    if (ctx === 'afternoon') return '🌤️ 下午茶精選'
    if (ctx === 'evening') return '🌆 晚餐精選'
    return '🌙 夜宵精選'
  }

  const getTimeIcon = (ctx) => {
    if (ctx === 'morning') return '🌅'
    if (ctx === 'noon') return '☀️'
    if (ctx === 'afternoon') return '🌤️'
    if (ctx === 'evening') return '🌆'
    return '🌙'
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
              <div className="text-sm opacity-80">香港 • {getTimeTitle(timeContext).split(' ')[1]}</div>
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
      <div className={`rounded-xl p-3 border ${usingGoogle ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100/50' : 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100/50'}`}>
        <div className="flex items-center gap-2">
          <Brain className={`w-4 h-4 ${usingGoogle ? 'text-emerald-500' : 'text-violet-500'}`} />
          <span className={`text-sm font-medium ${usingGoogle ? 'text-emerald-700' : 'text-violet-700'}`}>
            🧠 為你根據時間同位置智能推薦 {usingGoogle ? '（Google 實時數據）' : '（離線模式）'}
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
            <span className="text-xs text-zinc-400">{section.source}</span>
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
