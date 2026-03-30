import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, TrendingUp, Clock, MapPin, Star, Heart, Gift, Zap, Brain, Sun, Cloud, RefreshCw, Image } from 'lucide-react'
import { searchForRecommendations, isPlacesServiceReady } from '../services/GooglePlacesService'

// Fallback data for when API fails
const FALLBACK_DATA = {
  hong_kong: {
    restaurants: [
      { id: 'hk_1', name: '九記牛腩', rating: 4.7, price: 58, lat: 22.3065, lng: 114.1707, category: 'restaurants', description: '米芝蓮推薦，牛腩軟腍', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200' },
      { id: 'hk_2', name: '一蘭拉麵', rating: 4.8, price: 108, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '正宗豚骨湯底', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200' },
      { id: 'hk_3', name: '鼎泰豐', rating: 4.6, price: 80, lat: 22.2978, lng: 114.1690, category: 'restaurants', description: '小籠包名店', imageUrl: 'https://images.unsplash.com/photo-1582833867451-65ac56d0a7e6?w=200' },
      { id: 'hk_4', name: '華嫂冰室', rating: 4.5, price: 50, lat: 22.3165, lng: 114.1727, category: 'restaurants', description: '菠蘿油必試', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200' },
    ],
    places: [
      { id: 'hk_10', name: '山頂纜車', rating: 4.8, price: 88, lat: 22.2665, lng: 114.1570, category: 'places', description: '維港全景', imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c979e65?w=200' },
      { id: 'hk_11', name: '維多利亞港', rating: 4.9, price: 0, lat: 22.2855, lng: 114.1617, category: 'places', description: '世界三大夜景', imageUrl: 'https://images.unsplash.com/photo-1530479669743-6d1c4f5d9482?w=200' },
      { id: 'hk_12', name: '迪士尼樂園', rating: 4.7, price: 639, lat: 22.3129, lng: 114.0414, category: 'places', description: '奇妙夢幻國度', imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=200' },
    ]
  }
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

const getWeatherIcon = (condition) => {
  const icons = {
    sunny: <Sun className="w-5 h-5 text-amber-500" />,
    cloudy: <Cloud className="w-5 h-5 text-zinc-400" />,
  }
  return icons[condition] || <Sun className="w-5 h-5 text-amber-500" />
}

// Placeholder images
const PLACEHOLDER = {
  restaurants: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop',
  places: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop'
}

const EMOJI_PLACEHOLDER = {
  restaurants: '🍜',
  places: '🎯'
}

export default function SmartRecommendations({ places = [], region = 'hong_kong', userLocation = null, mapReady = false, onPlaceSelect }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [usingGoogle, setUsingGoogle] = useState(false)
  const [weather] = useState({ condition: 'sunny', temp: 26 })
  const [forceUpdate, setForceUpdate] = useState(0)
  
  // Use ref to track previous values and avoid stale closures
  const stateRef = useRef({ mapReady, userLocation, region })
  const timeContext = getTimeContext()

  // Update ref on every render
  useEffect(() => {
    stateRef.current = { mapReady, userLocation, region }
    console.log('📊 SmartRecommendations state updated:', { mapReady, userLocation: !!userLocation, region, forceUpdate })
  }, [mapReady, userLocation, region, forceUpdate])

  const fetchRecommendations = useCallback(async () => {
    const { mapReady, userLocation, region } = stateRef.current
    
    console.log('🤖 fetchRecommendations called', { mapReady, hasLocation: !!userLocation, region })
    
    setRefreshing(true)
    
    // Check if PlacesService is ready
    const serviceReady = isPlacesServiceReady()
    console.log('🔍 PlacesService ready?', serviceReady)
    console.log('🔍 mapReady prop?', mapReady)
    console.log('🔍 userLocation prop?', !!userLocation)
    
    try {
      // Try Google Places if service is ready and we have location
      if (serviceReady && userLocation) {
        console.log('🔍 Using Google Maps Places API...')
        const results = await searchForRecommendations(region, timeContext, userLocation)
        
        if (results.length > 0) {
          console.log('✅ Google Places found:', results.length, 'places')
          setUsingGoogle(true)
          
          const sections = [
            {
              type: 'google',
              title: getTimeTitle(timeContext),
              places: results.slice(0, 4),
              icon: getTimeIcon(timeContext),
              source: '🔍 Google 實時數據'
            },
            {
              type: 'trending',
              title: '🔥 熱門精選',
              places: results.slice(4, 8),
              icon: '🔥',
              source: '🔍 Google 實時數據'
            }
          ]
          
          setRecommendations(sections.filter(s => s.places.length > 0))
          setLoading(false)
          setRefreshing(false)
          return
        } else {
          console.log('⚠️ Google Places returned no results')
        }
      } else {
        console.log('⚠️ Cannot use Google Places:', { serviceReady, hasLocation: !!userLocation })
      }
      
      // Use fallback data
      throw new Error('Using fallback data')
    } catch (error) {
      console.log('⚠️ Using fallback data:', error.message)
      setUsingGoogle(false)
      
      const fallback = FALLBACK_DATA[region] || FALLBACK_DATA.hong_kong
      
      const sections = [
        {
          type: 'time',
          title: getTimeTitle(timeContext),
          places: fallback.restaurants.slice(0, 4),
          icon: getTimeIcon(timeContext),
          source: '📍 樣本數據'
        },
        {
          type: 'places',
          title: '🎯 必去景點',
          places: fallback.places.slice(0, 4),
          icon: '🎯',
          source: '📍 樣本數據'
        }
      ]
      
      setRecommendations(sections)
    }
    
    setLoading(false)
    setRefreshing(false)
  }, [timeContext]) // Only timeContext as dependency for useCallback

  // Initial load and when map becomes ready or location changes
  useEffect(() => {
    console.log('📡 useEffect triggered:', { mapReady, userLocation: !!userLocation })
    fetchRecommendations()
  }, [mapReady, userLocation, fetchRecommendations])

  const handleRefresh = () => {
    console.log('🔄 Refresh requested')
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

  const getPlaceImage = (place) => {
    if (place.photos && place.photos.length > 0) return place.photos[0]
    if (place.imageUrl) return place.imageUrl
    return PLACEHOLDER[place.category] || PLACEHOLDER.places
  }

  const CompactPlaceCard = ({ place }) => (
    <div 
      onClick={() => onPlaceSelect?.(place)}
      className="bg-white rounded-xl overflow-hidden border border-zinc-100/80 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] flex"
    >
      <div className="relative w-20 h-20 shrink-0 bg-zinc-100">
        <img 
          src={getPlaceImage(place)} 
          alt={place.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            const parent = e.target.parentElement
            const emoji = EMOJI_PLACEHOLDER[place.category] || '📍'
            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-2xl">${emoji}</div>`
          }}
        />
        {place.rating && (
          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-white text-[10px] font-bold">{place.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-2.5 flex flex-col justify-center min-w-0">
        <h4 className="font-bold text-zinc-900 text-sm leading-tight line-clamp-1">{place.name}</h4>
        {place.description && (
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{place.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
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
  )

  if (loading) {
    return (
      <div className="space-y-4">
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
        
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse flex">
              <div className="w-20 h-20 bg-zinc-200 shrink-0" />
              <div className="flex-1 p-2.5">
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
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
              <CompactPlaceCard key={pIdx} place={place} />
            ))}
          </div>
        </div>
      ))}

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