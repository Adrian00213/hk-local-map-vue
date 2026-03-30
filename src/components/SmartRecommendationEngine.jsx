import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Clock, MapPin, Star, Heart, Gift, Zap, Brain, Sun, Moon, Cloud, CloudRain, Thermometer, Wind } from 'lucide-react'

// Smart Recommendation Engine - accepts places as prop for multi-region support
const RECOMMENDATIONS = {
  timeBased: {
    morning: {
      icon: '🌅',
      title: '早晨活動',
      places: [
        { name: '金記茶餐廳', category: '早餐', rating: 4.5, price: 35, distance: '0.3km', promotion: '早餐套餐減$5' },
        { name: '麥當勞', category: '快餐', rating: 4.2, price: 28, distance: '0.1km', promotion: '早晨套餐' },
        { name: '太平洋咖啡', category: 'café', rating: 4.4, price: 42, distance: '0.2km', promotion: 'Latte第二杯半價' },
      ]
    },
    noon: {
      icon: '☀️',
      title: '午餐精選',
      places: [
        { name: '九記牛腩', category: '麵食', rating: 4.7, price: 58, distance: '0.5km', promotion: '米線加小食減$10' },
        { name: '翠華', category: '茶餐廳', rating: 4.3, price: 48, distance: '0.4km', promotion: '海南雞飯特價' },
        { name: '一蘭拉麵', category: '日本', rating: 4.8, price: 108, distance: '0.8km', promotion: '二人同行送小食' },
      ]
    },
    afternoon: {
      icon: '🌤️',
      title: '下午休閒',
      places: [
        { name: '星巴克', category: 'café', rating: 4.3, price: 45, distance: '0.2km', promotion: '午後指定飲品減$5' },
        { name: '海港城', category: '商場', rating: 4.6, price: 0, distance: '1.2km', promotion: '春日購物優惠' },
        { name: 'M+博物館', category: '文化', rating: 4.7, price: 0, distance: '2.5km', promotion: '免費導賞團' },
      ]
    },
    evening: {
      icon: '🌆',
      title: '晚餐推薦',
      places: [
        { name: '鼎泰豐', category: '中菜', rating: 4.6, price: 150, distance: '0.6km', promotion: '小籠包買三送一' },
        { name: '龍鳳會', category: '粵菜', rating: 4.5, price: 200, distance: '0.9km', promotion: '晚市8折' },
        { name: '意大利餐廳', category: '西餐', rating: 4.4, price: 180, distance: '0.7km', promotion: '紅酒免費' },
      ]
    },
    night: {
      icon: '🌙',
      title: '夜生活',
      places: [
        { name: '蘭桂坊', category: '酒吧', rating: 4.2, price: 80, distance: '1.5km', promotion: '指定飲品買一送一' },
        { name: '街邊小食', category: '小食', rating: 4.0, price: 25, distance: '0.3km', promotion: '魚蛋燒賣套餐' },
        { name: '便利店', category: '24小時', rating: 4.1, price: 15, distance: '0.1km', promotion: '夜宵特價' },
      ]
    }
  },
  weatherBased: {
    sunny: {
      icon: '☀️',
      title: '晴天戶外活動',
      places: [
        { name: '山頂', category: '景點', rating: 4.8, price: 0, distance: '3.0km', promotion: '纜車優惠' },
        { name: '淺水灣', category: '海灘', rating: 4.6, price: 0, distance: '8.0km', promotion: '沙灘設施開放' },
        { name: '維多利亞公園', category: '公園', rating: 4.4, price: 0, distance: '2.0km', promotion: '花展進行中' },
      ]
    },
    cloudy: {
      icon: '⛅',
      title: '多雲天氣',
      places: [
        { name: '香港太空館', category: '博物館', rating: 4.5, price: 30, distance: '1.5km', promotion: '全天域電影優惠' },
        { name: '科學館', category: '博物館', rating: 4.6, price: 30, distance: '2.0km', promotion: '家庭票優惠' },
        { name: '商場優惠', category: '購物', rating: 4.3, price: 0, distance: '0.5km', promotion: '春季折扣' },
      ]
    },
    rainy: {
      icon: '🌧️',
      title: '雨天室內活動',
      places: [
        { name: 'K11 MUSEA', category: '商場', rating: 4.7, price: 0, distance: '1.0km', promotion: '電影票優惠' },
        { name: '室內遊樂場', category: '玩樂', rating: 4.4, price: 150, distance: '2.5km', promotion: '兩小時送半小時' },
        { name: 'CAFÉ', category: '咖啡店', rating: 4.5, price: 45, distance: '0.3km', promotion: '雨季特飲' },
      ]
    }
  },
  budget: {
    icon: '💰',
    title: '慳錢之選',
    places: [
      { name: '美心MX', category: '快餐', rating: 4.2, price: 35, distance: '0.2km', promotion: '午市套餐' },
      { name: '大快活', category: '茶餐廳', rating: 4.1, price: 40, distance: '0.3km', promotion: '下午茶特價' },
      { name: '麥當勞', category: '快餐', rating: 4.0, price: 25, distance: '0.1km', promotion: '超值套餐' },
      { name: '街市小食', category: '街邊', rating: 4.3, price: 20, distance: '0.2km', promotion: '買三送一' },
    ]
  },
  trending: {
    icon: '🔥',
    title: '熱門話題',
    places: [
      { name: '新開的咖啡店', category: 'café', rating: 4.7, price: 55, distance: '0.5km', promotion: '開幕優惠' },
      { name: '限定美食展', category: '活動', rating: 4.5, price: 0, distance: '1.0km', promotion: '免費入場' },
      { name: '人氣打卡點', category: '景點', rating: 4.8, price: 0, distance: '2.0km', promotion: '最新裝置藝術' },
    ]
  }
}

// Get time context
const getTimeContext = () => {
  const now = new Date()
  const hour = now.getHours()
  
  if (hour >= 5 && hour < 11) return 'morning'
  else if (hour >= 11 && hour < 14) return 'noon'
  else if (hour >= 14 && hour < 18) return 'afternoon'
  else if (hour >= 18 && hour < 22) return 'evening'
  else return 'night'
}

// Get weather context (simulated - could integrate with real API)
const getWeatherContext = () => {
  const conditions = ['sunny', 'cloudy', 'rainy']
  // Simulate based on random for demo - in production would use real API
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 18) return 'sunny'
  return 'cloudy'
}

// Get mock weather data
const getWeatherData = () => {
  const hour = new Date().getHours()
  const isDay = hour >= 6 && hour < 18
  
  return {
    temp: Math.floor(Math.random() * 10) + 24,
    humidity: Math.floor(Math.random() * 30) + 60,
    condition: isDay ? 'sunny' : 'cloudy',
    uv: Math.floor(Math.random() * 5) + 3,
    feelsLike: Math.floor(Math.random() * 5) + 26,
  }
}

export default function SmartRecommendations({ places = [] }) {
  const [recommendations, setRecommendations] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Get context
    const timeContext = getTimeContext()
    const weatherContext = getWeatherContext()
    const weatherData = getWeatherData()
    
    setWeather(weatherData)
    
    // Generate smart recommendations based on context and places
    const smartRecs = generateSmartRecommendations(timeContext, weatherContext, places)
    setRecommendations(smartRecs)
    setLoading(false)
  }, [refreshKey, places])

  const generateSmartRecommendations = (timeContext, weatherContext, places) => {
    const recs = []
    
    // Filter places by category for time-based
    const restaurants = places.filter(p => p.category === 'restaurants').slice(0, 3)
    const attractions = places.filter(p => p.category === 'places').slice(0, 3)
    
    // Add time-based recommendations
    recs.push({
      type: 'time',
      places: restaurants.length > 0 ? restaurants : RECOMMENDATIONS.timeBased[timeContext]?.places || [],
      smartReason: `根據而家${getTimeLabel(timeContext)}為你推薦`
    })
    
    // Add weather-based recommendations
    recs.push({
      type: 'weather',
      places: weatherRecs?.places || [],
      smartReason: `${weatherContext === 'rainy' ? '🌧️ 落雨喇，室內活動最適合！' : weatherContext === 'sunny' ? '☀️ 好天氣，戶外活動約起來！' : '⛅ 多雲天氣，四處走走也不錯！'}`
    })
    
    // Add attractions
    recs.push({
      type: 'places',
      places: attractions,
      smartReason: '🎯 熱門景點精選'
    })
    
    // Add trending
    recs.push({
      type: 'trending',
      places: places.slice(0, 3),
      smartReason: '🔥 為你精選'
    })
    
    return recs
  }

  const getTimeLabel = (time) => {
    const labels = {
      morning: '朝早',
      noon: '中午',
      afternoon: '下午',
      evening: '晚晚',
      night: '夜晚'
    }
    return labels[time] || '而家'
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: <Sun className="w-5 h-5 text-amber-500" />,
      cloudy: <Cloud className="w-5 h-5 text-zinc-400" />,
      rainy: <CloudRain className="w-5 h-5 text-blue-400" />
    }
    return icons[condition] || <Sun className="w-5 h-5 text-amber-500" />
  }

  const PlaceCard = ({ place }) => (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-amber-100/50 card-hover">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl">
          {place.category === 'café' ? '☕' : 
           place.category === '商場' ? '🛍️' :
           place.category === '景點' ? '🎯' :
           place.category === '酒吧' ? '🍺' :
           place.category === '麵食' ? '🍜' :
           '📍'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 truncate">{place.name}</h4>
            <span className="text-xs text-zinc-400">{place.distance}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">{place.category}</span>
            <span className="flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" />
              {place.rating}
            </span>
            {place.price > 0 && (
              <span className="text-xs text-zinc-400">${place.price}</span>
            )}
          </div>
          {place.promotion && (
            <div className="flex items-center gap-1 mt-2">
              <Gift className="w-3 h-3 text-pink-500" />
              <span className="text-xs text-pink-500 font-medium">{place.promotion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const SectionHeader = ({ icon, title, reason }) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <h3 className="font-bold text-zinc-900">{title}</h3>
        <p className="text-xs text-zinc-500">{reason}</p>
      </div>
      <button 
        onClick={() => setRefreshKey(k => k + 1)}
        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-zinc-500">智能分析中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weather Widget */}
      {weather && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-amber-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="text-2xl font-bold">{weather.temp}°C</div>
                <div className="text-sm opacity-80">體感 {weather.feelsLike}°C</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4 opacity-80" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>☀️</span>
                <span>UV {weather.uv}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Reason */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100/50">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-500" />
          <div>
            <p className="text-sm font-semibold text-violet-700">🧠 智能分析</p>
            <p className="text-xs text-violet-500 mt-0.5">
              基於你的位置、現在時間、天氣為你個人化推薦
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Sections */}
      {recommendations.map((section, idx) => (
        <div key={idx} className="space-y-3">
          <SectionHeader 
            icon={section.icon} 
            title={section.title} 
            reason={section.smartReason}
          />
          <div className="space-y-2">
            {section.places.slice(0, 3).map((place, pIdx) => (
              <PlaceCard key={pIdx} place={place} />
            ))}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button className="p-4 bg-white/80 backdrop-blur rounded-2xl border border-amber-100/50 flex items-center gap-3 card-hover">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-pink-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-zinc-900">熱門精選</p>
            <p className="text-xs text-zinc-500">實時更新</p>
          </div>
        </button>
        
        <button className="p-4 bg-white/80 backdrop-blur rounded-2xl border border-amber-100/50 flex items-center gap-3 card-hover">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-zinc-900">今日特選</p>
            <p className="text-xs text-zinc-500">限時優惠</p>
          </div>
        </button>
      </div>
    </div>
  )
}
