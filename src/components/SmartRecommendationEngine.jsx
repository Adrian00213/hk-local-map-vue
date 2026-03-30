import { useState, useEffect, useCallback } from 'react'
import { Sparkles, TrendingUp, Clock, MapPin, Star, Heart, Gift, Zap, Brain, Sun, Cloud, RefreshCw } from 'lucide-react'
import { searchPlacesMultiType, getNearbyPlaces } from '../services/PlaceSearch'

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
  const [weather] = useState({ condition: 'sunny', temp: 26 })
  const timeContext = getTimeContext()

  // Fetch recommendations based on time and location
  const fetchRecommendations = useCallback(async () => {
    setRefreshing(true)
    try {
      const results = []
      
      // 1. Time-based recommendation
      const timePrompt = TIME_PROMPTS[timeContext]
      const timeBasedPlaces = await searchPlacesMultiType(region, timePrompt, { limit: 5 })
      if (timeBasedPlaces.length > 0) {
        results.push({
          type: 'time',
          title: timeContext === 'morning' ? '🌅 朝早精選' :
                 timeContext === 'noon' ? '☀️ 午餐精選' :
                 timeContext === 'afternoon' ? '🌤️ 下午茶精選' :
                 timeContext === 'evening' ? '🌆 晚餐精選' : '🌙 夜宵精選',
          places: timeBasedPlaces.slice(0, 3),
          icon: timeContext === 'morning' ? '🌅' : timeContext === 'noon' ? '☀️' :
                timeContext === 'afternoon' ? '🌤️' : timeContext === 'evening' ? '🌆' : '🌙'
        })
      }
      
      // 2. Nearby places (if location available)
      if (userLocation) {
        const nearbyPlaces = await getNearbyPlaces(userLocation.lat, userLocation.lng, { limit: 5 })
        if (nearbyPlaces.length > 0) {
          results.push({
            type: 'nearby',
            title: '📍 你附近熱門',
            places: nearbyPlaces.slice(0, 3),
            icon: '📍'
          })
        }
      }
      
      // 3. Trending/Popular in region
      const trendingPlaces = await searchPlacesMultiType(region, 'popular attraction restaurant', { limit: 5 })
      if (trendingPlaces.length > 0) {
        results.push({
          type: 'trending',
          title: '🔥 熱門精選',
          places: trendingPlaces.slice(0, 3),
          icon: '🔥'
        })
      }
      
      setRecommendations(results)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      // Fallback to local sample data
      if (places.length > 0) {
        setRecommendations([{
          type: 'local',
          title: '📍 本地精選',
          places: places.slice(0, 6),
          icon: '📍'
        }])
      }
    }
    setLoading(false)
    setRefreshing(false)
  }, [region, userLocation, timeContext, places])

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
          {place.open_now !== undefined && (
            <p className={`text-xs mt-0.5 ${place.open_now ? 'text-emerald-600' : 'text-zinc-400'}`}>
              {place.open_now ? '✓ 營業中' : '✗ 已關門'}
            </p>
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
            🧠 為你根據時間同位置智能推薦
          </span>
        </div>
      </div>

      {/* Recommendation Sections */}
      {recommendations.map((section, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{section.icon}</span>
            <h3 className="font-bold text-zinc-900">{section.title}</h3>
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
