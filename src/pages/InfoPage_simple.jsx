import { useState, useEffect } from 'react'
import { Utensils, Star, Heart, Gift, MessageCircle, Search, MapPin, Navigation, Clock, Calendar, Sparkles, ChevronRight, RefreshCw, Wifi, X, Moon, Sun, UsersRound, ExternalLink, MessageCircle as MsgIcon, HeartHandshake } from 'lucide-react'

// HK 18 Districts
const HK_DISTRICTS = [
  { name: '中西區', icon: '🏛️' }, { name: '東區', icon: '🌊' }, { name: '南區', icon: '🏖️' },
  { name: '灣仔', icon: '🎯' }, { name: '九龍城', icon: '🏯' }, { name: '觀塘', icon: '🏭' },
  { name: '深水埗', icon: '🛒' }, { name: '黃大仙', icon: '🧧' }, { name: '油尖旺', icon: '✨' },
  { name: '離島', icon: '🏝️' }, { name: '葵青', icon: '🌺' }, { name: '北區', icon: '⛰️' },
  { name: '西頁', icon: '🗻' }, { name: '沙田', icon: '🏞️' }, { name: '大埔', icon: '🌳' },
  { name: '荃灣', icon: '🌸' }, { name: '屯門', icon: '🏮' }, { name: '元朗', icon: '🌾' },
]

// Mock Deals
const MOCK_DEALS = [
  { id: 1, brand: '麥當勞', title: '巨無霸套餐半價優惠', desc: '任何時間適用', discount: '50%', badge: '熱賣', color: 'from-yellow-400 to-orange-500' },
  { id: 2, brand: '星巴克', title: '買一送一', desc: '指定飲品', discount: '50%', badge: '限時', color: 'from-green-400 to-emerald-500' },
  { id: 3, brand: '肯德基', title: '炸雞桶減價', desc: '只限外賣', discount: '30%', badge: '抵食', color: 'from-red-400 to-rose-500' },
]

// Restaurant Card
const RestaurantCard = ({ restaurant, onLike }) => {
  const getCuisineEmoji = (type) => {
    const map = { restaurant: '🍜', cafe: '☕', bar: '🍸', bakery: '🥐', fast_food: '🍔', food: '🍽️' }
    return map[type] || '🍽️'
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
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{restaurant.address}</p>
        </div>
        <button onClick={() => onLike(restaurant.name)} className="p-2 text-gray-400 hover:text-red-500">
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default function InfoPage({ showToast }) {
  const [activeTab, setActiveTab] = useState('food')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(50)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const { initRestaurants, getAllRestaurants, calculateDistance } = await import('../services/restaurantApi')
        await initRestaurants()
        const all = await getAllRestaurants()
        
        // Sort by distance from center of HK
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

  const handleLike = (name) => {
    showToast?.({ message: `❤️ 已收藏 ${name}`, type: 'success' })
  }

  return (
    <div className="h-full bg-gradient-to-b from-orange-50/50 to-amber-50/50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">🍜 餐飲</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'food', label: '🍽️ 餐飲' },
            { key: 'deals', label: '🎁 優惠' },
            { key: 'events', label: '📅 活動' },
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
        {activeTab === 'food' && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">載入中...</div>
            ) : (
              <>
                {restaurants.slice(0, displayCount).map((r, i) => (
                  <RestaurantCard key={r.name + i} restaurant={r} onLike={handleLike} />
                ))}
                {restaurants.length > displayCount && (
                  <button 
                    onClick={() => setDisplayCount(prev => Math.min(prev + 50, restaurants.length))}
                    className="w-full py-3 bg-orange-500 text-white rounded-2xl text-sm font-medium"
                  >
                    載入更多 ({displayCount}/{restaurants.length})
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 border border-amber-100 dark:border-gray-600">
              <h2 className="font-bold text-gray-900 dark:text-white">🎁 香港優惠</h2>
              <p className="text-sm text-gray-500">{MOCK_DEALS.length} 個精選優惠</p>
            </div>
            {MOCK_DEALS.map(deal => (
              <div key={deal.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${deal.color} flex flex-col items-center justify-center`}>
                    <span className="text-white font-bold">{deal.discount}</span>
                    <span className="text-white/80 text-xs">OFF</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{deal.brand}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white">{deal.title}</h3>
                    <p className="text-xs text-gray-500">{deal.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">🎭</div>
            <p>暫時未有活動資訊</p>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📰</div>
            <p>暫時未有新聞</p>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">👥</div>
            <p>社群功能即將推出</p>
          </div>
        )}
      </div>
    </div>
  )
}
