import { useState, useEffect, useRef } from 'react'
import { Utensils, Star, ThumbsUp, MapPin, Navigation, Clock, Search, Filter, X, Calendar, AlertCircle, Users, MessageCircle, Sparkles, ChevronRight, Heart, Share2, RefreshCw, Wifi } from 'lucide-react'
import { getNearbyRestaurants, getTopRatedRestaurants, getRestaurantsByCuisine, getCuisineTypes, formatPrice, getPopularityScore } from '../services/restaurantApi'
import { getAllEvents, formatEventDate, getEventStatus } from '../services/eventsApi'
import LiveChat from '../components/LiveChat'

// Refresh Timer Bar Component
const RefreshTimerBar = ({ onRefresh }) => {
  const [secondsLeft, setSecondsLeft] = useState(300) // 5 minutes
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const intervalRef = useRef(null)

  useEffect(() => {
    // Countdown timer
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleRefresh()
          return 300
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [])

  const handleRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLastUpdate(new Date())
    setSecondsLeft(300)
    setIsRefreshing(false)
    onRefresh?.()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatLastUpdate = (date) => {
    const diff = Math.floor((new Date() - date) / 1000)
    if (diff < 60) return '剛剛'
    if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
    return date.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })
  }

  const progress = ((300 - secondsLeft) / 300) * 100

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-blue-800">📡 數據同步中</p>
            <p className="text-xs text-blue-500">上次更新: {formatLastUpdate(lastUpdate)}</p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95 ${
            isRefreshing ? 'opacity-70' : ''
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? '更新中...' : '立即更新'}
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-1.5 bg-blue-100 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
        {/* Animated dots */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md animate-pulse" />
      </div>
      
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-blue-400">0:00</span>
        <span className="text-xs font-medium text-blue-600">下次更新: {formatTime(secondsLeft)}</span>
        <span className="text-xs text-blue-400">5:00</span>
      </div>
    </div>
  )
}

// Cuisine emoji mapping
const getCuisineEmoji = (cuisine) => {
  const map = {
    '港式': '🇭🇰', '日式': '🍣', '中式': '🥢', '西式': '🍽️', '意式': '🍕',
    '法式': '🥐', '泰式': '🌶️', '韓式': '🇰🇷', '越南': '🍜', '印度': '🇮🇳',
    '海鮮': '🦐', '快餐': '🍔', '甜品': '🍮', '茶餐廳': '🧋', '麵食': '🍝',
    '燒味': '🍖', '點心': '🥟', '粥品': '🥣', '小食': '🍢', '冰室': '🧊',
    '大排檔': '🏮', '雲吞麵': '🥟', '海鮮': '🦀'
  }
  return map[cuisine] || '🍴'
}

// Cute rating stars
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className={`text-sm ${i < fullStars ? 'opacity-100' : i === fullStars && hasHalf ? 'opacity-50' : 'opacity-20'}`}
        >
          ⭐
        </span>
      ))}
      <span className="ml-1 text-sm font-bold text-amber-600">{rating}</span>
    </div>
  )
}

// Restaurant card with cute animations
const RestaurantCard = ({ restaurant, index, onLike }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  
  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer border border-gray-100"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setShowDetail(!showDetail)}
    >
      <div className="flex gap-3">
        {/* Food Emoji Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl shrink-0">
          {getCuisineEmoji(restaurant.cuisine)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 truncate">{restaurant.name}</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
                onLike?.()
              }}
              className={`p-1 rounded-full transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400'}`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
              {restaurant.cuisine}
            </span>
            <span className="text-xs px-2 py-0.5 bg-amber-50 rounded-full text-amber-600">
              {restaurant.price}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <RatingStars rating={restaurant.rating} />
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {restaurant.district}
            </span>
          </div>
        </div>
      </div>
      
      {/* Expandable Detail */}
      {showDetail && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in">
          <p className="text-xs text-gray-500 mb-2">📍 {restaurant.address}</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1">
              <Heart className="w-4 h-4" /> 收藏
            </button>
            <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1">
              <Share2 className="w-4 h-4" /> 分享
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Cute event card
const EventCard = ({ event, index }) => (
  <div 
    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl shrink-0">
        {getEventStatus(event.startDate) === 'upcoming' ? '🔥' : '✨'}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
            {formatEventDate(event.startDate)}
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default function InfoPage({ showToast }) {
  const [activeTab, setActiveTab] = useState('nearby')
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyRestaurants, setNearbyRestaurants] = useState([])
  const [topRestaurants, setTopRestaurants] = useState([])
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [cuisineTypes, setCuisineTypes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const [nearby, top, cuisines] = await Promise.all([
        getNearbyRestaurants(22.3193, 114.1694, 5),
        getTopRatedRestaurants(50),
        getCuisineTypes()
      ])
      
      setNearbyRestaurants(nearby.slice(0, 20))
      setTopRestaurants(top)
      setCuisineTypes(cuisines.slice(0, 15))
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude }
            setUserLocation(loc)
          },
          () => {}
        )
      }
    }
    loadData()
  }, [])

  // Load events lazily
  useEffect(() => {
    if (activeTab === 'events' && events.length === 0) {
      setEventsLoading(true)
      getAllEvents().then(data => {
        setEvents(data)
        setEventsLoading(false)
      })
    }
  }, [activeTab])

  const handleLike = (name) => {
    showToast?.({ message: `❤️ 已收藏 ${name}`, type: 'success' })
  }

  // Filter restaurants
  const displayedRestaurants = cuisineFilter 
    ? topRestaurants.filter(r => r.cuisine.includes(cuisineFilter))
    : topRestaurants

  return (
    <div className="h-full bg-gradient-to-b from-orange-50/50 to-amber-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-amber-100 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              🍜 美食指南
            </h1>
            <p className="text-xs text-gray-500">
              {userLocation ? '📍 已開啟位置' : '🌍 顯示全港美食'}
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搵餐廳... 🔍"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
        </div>
        
        {/* Tab Switcher */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              activeTab === 'nearby'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            📍 附近
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              activeTab === 'top'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            ⭐ 人氣
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            📅 活動
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            💬 討論
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Refresh Timer Bar */}
        <RefreshTimerBar onRefresh={() => {
          // Refresh data
          getTopRatedRestaurants(50).then(setTopRestaurants)
        }} />
        
        {/* Nearby Tab */}
        {activeTab === 'nearby' && (
          <div className="space-y-3">
            {/* Location Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">為你嚴選附近美食</p>
                <p className="text-xs text-green-600">基於你的位置推薦</p>
              </div>
              <ChevronRight className="w-5 h-5 text-green-400" />
            </div>
            
            {/* Nearby Restaurants */}
            <div className="space-y-3">
              {nearbyRestaurants.map((r, i) => (
                <RestaurantCard 
                  key={r.name} 
                  restaurant={r} 
                  index={i}
                  onLike={() => handleLike(r.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Top Tab */}
        {activeTab === 'top' && (
          <div className="space-y-4">
            {/* Cuisine Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setCuisineFilter('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  !cuisineFilter ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border'
                }`}
              >
                全部
              </button>
              {cuisineTypes.map(c => (
                <button
                  key={c}
                  onClick={() => setCuisineFilter(cuisineFilter === c ? '' : c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    cuisineFilter === c ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border'
                  }`}
                >
                  {getCuisineEmoji(c)} {c}
                </button>
              ))}
            </div>
            
            {/* Top Restaurants */}
            <div className="space-y-3">
              {displayedRestaurants
                .filter(r => !searchQuery || r.name.includes(searchQuery))
                .slice(0, 30)
                .map((r, i) => (
                  <RestaurantCard 
                    key={r.name} 
                    restaurant={r} 
                    index={i}
                    onLike={() => handleLike(r.name)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {eventsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-gray-500">緊係... 💫</p>
              </div>
            ) : events.length > 0 ? (
              <>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100">
                  <p className="text-sm font-medium text-purple-800">
                    🎉 香港精彩活動
                  </p>
                  <p className="text-xs text-purple-600 mt-1">即將舉行 {events.length} 個活動</p>
                </div>
                <div className="space-y-3">
                  {events.slice(0, 20).map((e, i) => (
                    <EventCard key={e.id || i} event={e} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎭</div>
                <p className="text-gray-500">暫時未有活動資訊</p>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-280px)] -mx-4 -mb-4">
            <LiveChat channel="food-chat" />
          </div>
        )}
      </div>
    </div>
  )
}
