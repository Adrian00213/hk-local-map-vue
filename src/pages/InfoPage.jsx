import { useState, useEffect, useMemo } from 'react'
import { Utensils, Star, Heart, Gift, MessageCircle, Search, MapPin, Navigation, Clock, Calendar, Sparkles, ChevronRight, RefreshCw, Wifi, X, Moon, Sun, UsersRound, ExternalLink, MessageCircle as MsgIcon, HeartHandshake, Globe, TrendingUp, Newspaper, Building2, Users, Filter, Trash2, Bookmark } from 'lucide-react'

// HK 18 Districts
const HK_DISTRICTS = [
  { name: '中西區', icon: '🏛️' }, { name: '東區', icon: '🌊' }, { name: '南區', icon: '🏖️' },
  { name: '灣仔', icon: '🎯' }, { name: '九龍城', icon: '🏯' }, { name: '觀塘', icon: '🏭' },
  { name: '深水埗', icon: '🛒' }, { name: '黃大仙', icon: '🧧' }, { name: '油尖旺', icon: '✨' },
  { name: '離島', icon: '🏝️' }, { name: '葵青', icon: '🌺' }, { name: '北區', icon: '⛰️' },
  { name: '西頁', icon: '🗻' }, { name: '沙田', icon: '🏞️' }, { name: '大埔', icon: '🌳' },
  { name: '荃灣', icon: '🌸' }, { name: '屯門', icon: '🏮' }, { name: '元朗', icon: '🌾' },
]

// Real News Categories - Empty but ready for real data
const NEWS_CATEGORIES = [
  { key: 'latest', label: '📰 最新', empty: true },
  { key: 'district', label: '📍 區議會', empty: true },
]

// Community Platforms - Real HK forums
const COMMUNITY_PLATFORMS = [
  { id: 1, name: '香港討論區', desc: '全港最大討論區', icon: '💬', color: 'from-blue-400 to-indigo-500', members: '50萬+', link: 'https://www.discuss.com.hk' },
  { id: 2, name: 'Uwants', desc: '本地生活討論', icon: '💭', color: 'from-purple-400 to-pink-500', members: '30萬+', link: 'https://www.uwants.com' },
  { id: 3, name: 'Baby-Kingdom', desc: '親子育兒熱點', icon: '👶', color: 'from-pink-400 to-rose-500', members: '20萬+', link: 'https://www.baby-kingdom.com' },
  { id: 4, name: '我的世紀', desc: '升學移民資訊', icon: '✈️', color: 'from-teal-400 to-cyan-500', members: '15萬+', link: 'https://www.mysmoothheap.com' },
]

// District Groups
const DISTRICT_GROUPS = [
  { district: '中西區', name: '中西區街坊會', members: '2.3萬' },
  { district: '灣仔', name: '灣仔社區事務', members: '1.8萬' },
  { district: '東區', name: '東區人', members: '3.2萬' },
  { district: '觀塘', name: '觀塘友', members: '4.5萬' },
  { district: '油尖旺', name: '油尖旺街坊', members: '2.8萬' },
  { district: '沙田', name: '沙田社區', members: '3.8萬' },
  { district: '屯門', name: '屯門街坊', members: '3.2萬' },
  { district: '元朗', name: '元朗人', members: '4.1萬' },
]

// Restaurant Card
const RestaurantCard = ({ restaurant, isLiked, onLike, onUnlike }) => {
  const getCuisineEmoji = (type) => {
    const map = { restaurant: '🍜', cafe: '☕', bar: '🍸', bakery: '🥐', fast_food: '🍔', food: '🍽️' }
    return map[type] || '🍽️'
  }
  
  const handleHeart = () => {
    if (isLiked) {
      onUnlike(restaurant.name)
    } else {
      onLike(restaurant.name)
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 flex items-center justify-center text-2xl">
          {getCuisineEmoji(restaurant.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{restaurant.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">{restaurant.type}</span>
            {restaurant.rating && <span className="text-xs text-amber-500">⭐ {restaurant.rating}</span>}
            {restaurant.distance && <span className="text-xs text-blue-500">📍 {restaurant.distance}km</span>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{restaurant.address}</p>
        </div>
        <button 
          onClick={handleHeart}
          className={`p-2 rounded-full transition-all ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-300 hover:text-red-400'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}

// Empty State Component
const EmptyState = ({ icon, title, subtitle }) => (
  <div className="text-center py-16">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
    <p className="text-gray-500 mt-2">{subtitle}</p>
  </div>
)

// Forum Card
const ForumCard = ({ forum }) => (
  <a href={forum.link} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${forum.color} flex items-center justify-center text-xl`}>
        {forum.icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 dark:text-white">{forum.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{forum.desc}</p>
        <div className="flex items-center gap-1 mt-1">
          <Users className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">{forum.members} 會員</span>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400" />
    </div>
  </a>
)

// District Group Card
const DistrictGroupCard = ({ group }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{group.district}</p>
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{group.name}</h4>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Users className="w-3 h-3" />
        <span>{group.members}</span>
      </div>
    </div>
  </div>
)

export default function InfoPage({ showToast }) {
  const [activeTab, setActiveTab] = useState('food')
  const [communityTab, setCommunityTab] = useState('forums')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(50)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  
  // Favorites state (persisted to localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('hkmap_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  
  // Districts filter
  const [selectedDistrict, setSelectedDistrict] = useState('')

  // Load restaurants
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const { initRestaurants, getAllRestaurants, calculateDistance } = await import('../services/restaurantApi')
        await initRestaurants()
        const all = await getAllRestaurants()
        
        const centerLat = 22.3193
        const centerLng = 114.1694
        const sorted = all
          .filter(r => r.lat && r.lng)
          .map(r => ({ ...r, distance: calculateDistance(centerLat, centerLng, r.lat, r.lng) }))
          .sort((a, b) => a.distance - b.distance)
        
        setRestaurants(sorted)
      } catch (e) {
        console.error('Failed to load restaurants:', e)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hkmap_favorites', JSON.stringify(favorites))
    } catch (e) {
      console.error('Failed to save favorites:', e)
    }
  }, [favorites])

  const handleLike = (name) => {
    setFavorites(prev => [...prev, { name, timestamp: Date.now() }])
    showToast?.({ message: `❤️ 已收藏：${name}`, type: 'success' })
  }

  const handleUnlike = (name) => {
    setFavorites(prev => prev.filter(f => f.name !== name))
    showToast?.({ message: `💔 已取消收藏`, type: 'success' })
  }

  const handleClearFavorites = () => {
    setFavorites([])
    showToast?.({ message: `🗑️ 已清空收藏`, type: 'success' })
  }

  // Filter restaurants based on search and district
  const filteredRestaurants = useMemo(() => {
    let result = restaurants
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        (r.address && r.address.toLowerCase().includes(query)) ||
        (r.type && r.type.toLowerCase().includes(query))
      )
    }
    
    // Filter by district
    if (selectedDistrict) {
      result = result.filter(r => r.district === selectedDistrict)
    }
    
    return result.slice(0, displayCount)
  }, [restaurants, searchQuery, selectedDistrict, displayCount])

  const totalFiltered = useMemo(() => {
    let result = restaurants
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        (r.address && r.address.toLowerCase().includes(query))
      )
    }
    
    if (selectedDistrict) {
      result = result.filter(r => r.district === selectedDistrict)
    }
    
    return result.length
  }, [restaurants, searchQuery, selectedDistrict])

  // Check if restaurant is liked
  const isLiked = (name) => favorites.some(f => f.name === name)

  return (
    <div className="h-full bg-gradient-to-b from-orange-50/50 to-amber-50/50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">🍜 資訊</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'food', label: '🍽️ 餐飲' },
            { key: 'favorites', label: `❤️ 收藏 (${favorites.length})` },
            { key: 'news', label: '📰 新聞' },
            { key: 'community', label: '👥 社區' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* 🍽️ Food Tab */}
        {activeTab === 'food' && (
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="sticky top-24 z-10 bg-gradient-to-b from-orange-50/80 to-amber-50/80 dark:from-gray-900 dark:to-gray-900 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜尋餐廳..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* District Quick Filter */}
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedDistrict('')}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${!selectedDistrict ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 border'}`}
                >
                  🏙️ 全部
                </button>
                {HK_DISTRICTS.slice(0, 6).map(d => (
                  <button
                    key={d.name}
                    onClick={() => setSelectedDistrict(d.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${selectedDistrict === d.name ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 border'}`}
                  >
                    {d.icon} {d.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Results count */}
            {searchQuery && (
              <p className="text-sm text-gray-500">
                搵到 {totalFiltered} 間「{searchQuery}」
              </p>
            )}
            
            {/* Restaurant List */}
            {loading ? (
              <div className="text-center py-12 text-gray-500">載入中...</div>
            ) : filteredRestaurants.length > 0 ? (
              <>
                {filteredRestaurants.map((r, i) => (
                  <RestaurantCard 
                    key={r.name + i} 
                    restaurant={r} 
                    isLiked={isLiked(r.name)}
                    onLike={handleLike}
                    onUnlike={handleUnlike}
                  />
                ))}
                {totalFiltered > displayCount && (
                  <button 
                    onClick={() => setDisplayCount(prev => Math.min(prev + 50, totalFiltered))}
                    className="w-full py-3 bg-orange-500 text-white rounded-2xl text-sm font-medium"
                  >
                    載入更多 ({displayCount}/{totalFiltered})
                  </button>
                )}
              </>
            ) : (
              <EmptyState 
                icon="🔍" 
                title="搵唔到" 
                subtitle={searchQuery ? `冇嘢叫「${searchQuery}」` : '呢個區冇餐廳'} 
              />
            )}
          </div>
        )}

        {/* ❤️ Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {favorites.length > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{favorites.length} 間收藏</p>
                <button 
                  onClick={handleClearFavorites}
                  className="text-xs text-red-500 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  清空
                </button>
              </div>
            )}
            
            {favorites.length > 0 ? (
              favorites.map((fav, i) => {
                const restaurant = restaurants.find(r => r.name === fav.name)
                if (!restaurant) return null
                return (
                  <RestaurantCard 
                    key={fav.name + i}
                    restaurant={restaurant}
                    isLiked={true}
                    onLike={handleLike}
                    onUnlike={handleUnlike}
                  />
                )
              })
            ) : (
              <EmptyState 
                icon="❤️" 
                title="未有收藏" 
                subtitle="撳心心收藏餐廳" 
              />
            )}
          </div>
        )}

        {/* 📰 News Tab - Empty but structured */}
        {activeTab === 'news' && (
          <EmptyState 
            icon="📰" 
            title="新聞功能準備中" 
            subtitle="我哋整合緊真實新聞來源，敬請期待！" 
          />
        )}

        {/* 👥 Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-4">
            {/* Community Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'forums', label: '💬 討論區' },
                { key: 'districts', label: '📍 十八區' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setCommunityTab(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    communityTab === tab.key 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Forums */}
            {communityTab === 'forums' && (
              <div className="space-y-3">
                {COMMUNITY_PLATFORMS.map(forum => (
                  <ForumCard key={forum.id} forum={forum} />
                ))}
              </div>
            )}
            
            {/* District Groups */}
            {communityTab === 'districts' && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 border border-purple-100 dark:border-gray-600">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    香港十八區 Facebook 社群
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">各區街坊會 Facebook 群組</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DISTRICT_GROUPS.map(group => (
                    <DistrictGroupCard key={group.district} group={group} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
