import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, Star, Brain, Sun, RefreshCw, MapPin, Navigation } from 'lucide-react'
import { searchForRecommendations, isPlacesServiceReady } from '../services/GooglePlacesService'

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

const getTimeContext = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

const EMOJI_MAP = {
  restaurants: '🍜',
  places: '🎯',
  default: '📍'
}

const getEmoji = (category) => EMOJI_MAP[category] || EMOJI_MAP.default

export default function SmartRecommendations({ region = 'hong_kong', userLocation = null, mapReady = false, onPlaceSelect }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [usingGoogle, setUsingGoogle] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  
  const stateRef = useRef({ mapReady, userLocation, region })
  const timeContext = getTimeContext()
  const weather = { temp: 26 }

  useEffect(() => {
    stateRef.current = { mapReady, userLocation, region }
  }, [mapReady, userLocation, region, forceUpdate])

  const fetchRecommendations = useCallback(async () => {
    const { mapReady, userLocation, region } = stateRef.current
    
    setRefreshing(true)
    const serviceReady = isPlacesServiceReady()
    
    try {
      if (serviceReady && userLocation) {
        const results = await searchForRecommendations(region, timeContext, userLocation)
        
        if (results.length > 0) {
          setUsingGoogle(true)
          
          const sections = [
            { type: 'google', title: getTimeTitle(timeContext), places: results.slice(0, 4), icon: getTimeIcon(timeContext), source: '🔍 Google 實時數據' },
            { type: 'trending', title: '🔥 熱門精選', places: results.slice(4, 8), icon: '🔥', source: '🔍 Google 實時數據' }
          ]
          
          setRecommendations(sections.filter(s => s.places.length > 0))
          setLoading(false)
          setRefreshing(false)
          return
        }
      }
      throw new Error('Using fallback')
    } catch (error) {
      setUsingGoogle(false)
      
      const fallback = FALLBACK_DATA[region] || FALLBACK_DATA.hong_kong
      
      const sections = [
        { type: 'time', title: getTimeTitle(timeContext), places: fallback.restaurants.slice(0, 4), icon: getTimeIcon(timeContext), source: '📍 樣本數據' },
        { type: 'places', title: '🎯 必去景點', places: fallback.places.slice(0, 4), icon: '🎯', source: '📍 樣本數據' }
      ]
      
      setRecommendations(sections)
    }
    
    setLoading(false)
    setRefreshing(false)
  }, [timeContext])

  useEffect(() => {
    fetchRecommendations()
  }, [mapReady, userLocation, fetchRecommendations, forceUpdate])

  const handleRefresh = () => {
    setForceUpdate(f => f + 1)
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

  // Place Card with premium design
  const PlaceCard = ({ place }) => {
    const emoji = getEmoji(place.category)
    
    const handleNavigate = (e) => {
      e.stopPropagation()
      const lat = place.lat || place.geometry?.location?.lat()
      const lng = place.lng || place.geometry?.location?.lng()
      if (lat && lng) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank')
      }
    }

    return (
      <div 
        onClick={() => onPlaceSelect?.(place)}
        className="bg-white rounded-2xl border border-amber-100/50 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden"
      >
        <div className="flex">
          {/* Emoji Block */}
          <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0">
            <span className="text-3xl">{emoji}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-zinc-900 text-sm leading-tight line-clamp-1">{place.name}</h4>
                {place.description && (
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{place.description}</p>
                )}
              </div>
              <button
                onClick={handleNavigate}
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform"
              >
                <Navigation className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              {place.rating && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {place.rating}
                </span>
              )}
              {place.price_level !== undefined && place.price_level > 0 && (
                <span className="text-xs font-medium text-amber-600">
                  {'$'.repeat(place.price_level)}
                </span>
              )}
              {place.open_now !== undefined && (
                <span className={`text-[10px] ${place.open_now ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  {place.open_now ? '✓ 營業中' : '✗ 關門'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {/* Weather Widget - Loading */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-bold">{weather.temp}°C</div>
                <div className="text-sm opacity-80">香港</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-amber-100/30 overflow-hidden animate-pulse">
              <div className="flex">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-3xl opacity-50">🍜</span>
                </div>
                <div className="flex-1 p-3">
                  <div className="h-4 bg-amber-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-amber-50 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Weather Widget - Premium */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-200/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold">{weather.temp}°C</div>
              <div className="text-sm opacity-80">香港 • {getTimeTitle(timeContext).split(' ')[1]}</div>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Status Badge */}
      <div className={`rounded-2xl p-3 border ${usingGoogle ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/50' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50'}`}>
        <div className="flex items-center gap-2">
          <Brain className={`w-4 h-4 ${usingGoogle ? 'text-emerald-500' : 'text-amber-500'}`} />
          <span className={`text-xs font-medium ${usingGoogle ? 'text-emerald-700' : 'text-amber-700'}`}>
            🧠 為你根據時間同位置智能推薦
          </span>
          <span className={`ml-auto text-[10px] ${usingGoogle ? 'text-emerald-600' : 'text-amber-600'}`}>
            {usingGoogle ? '✓ Google 實時數據' : '📍 離線模式'}
          </span>
        </div>
      </div>

      {/* Recommendation Sections */}
      {recommendations.map((section, idx) => (
        <div key={idx} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{section.icon}</span>
            <h3 className="font-semibold text-zinc-900">{section.title}</h3>
            <span className="ml-auto text-xs text-zinc-400">{section.source}</span>
          </div>
          
          <div className="space-y-2">
            {section.places.map((place, pIdx) => (
              <PlaceCard key={pIdx} place={place} />
            ))}
          </div>
        </div>
      ))}

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-zinc-500 text-sm">暫時冇推薦</p>
          <button onClick={handleRefresh} className="mt-3 text-amber-600 text-sm font-medium hover:text-amber-700">
            重新整理 →
          </button>
        </div>
      )}
    </div>
  )
}