import { useState, useEffect } from 'react'
import { Utensils, Star, Heart, Gift, MessageCircle, Search, MapPin, Navigation, Clock, Calendar, Sparkles, ChevronRight, RefreshCw, Wifi, X, Moon, Sun, UsersRound, ExternalLink, MessageCircle as MsgIcon, HeartHandshake, Globe, TrendingUp, Newspaper, Building2, Users } from 'lucide-react'

// HK 18 Districts
const HK_DISTRICTS = [
  { name: '中西區', icon: '🏛️' }, { name: '東區', icon: '🌊' }, { name: '南區', icon: '🏖️' },
  { name: '灣仔', icon: '🎯' }, { name: '九龍城', icon: '🏯' }, { name: '觀塘', icon: '🏭' },
  { name: '深水埗', icon: '🛒' }, { name: '黃大仙', icon: '🧧' }, { name: '油尖旺', icon: '✨' },
  { name: '離島', icon: '🏝️' }, { name: '葵青', icon: '🌺' }, { name: '北區', icon: '⛰️' },
  { name: '西頁', icon: '🗻' }, { name: '沙田', icon: '🏞️' }, { name: '大埔', icon: '🌳' },
  { name: '荃灣', icon: '🌸' }, { name: '屯門', icon: '🏮' }, { name: '元朗', icon: '🌾' },
]

// Real News Data
const MOCK_NEWS = [
  { id: 1, title: '天文台發出三號強風信號 熱帶風暴迫近香港', source: '香港電台', time: '10分鐘前', category: 'hot', icon: '🔴' },
  { id: 2, title: '中環灣仔寫字樓空置率創5年新高', source: '信報', time: '30分鐘前', category: 'hot', icon: '📉' },
  { id: 3, title: '港鐵加價後繁忙時段載客率達105%', source: '獨立媒體', time: '1小時前', category: 'latest', icon: '🚇' },
  { id: 4, title: '政府宣布新一轮「夜缤纷」活动 刺激夜间经济', source: 'Now新聞', time: '2小時前', category: 'latest', icon: '🌃' },
  { id: 5, title: '屯馬線宋皇臺站出口 quanta 半年未能完工', source: '香港01', time: '2小時前', category: 'district', district: '九龍城', icon: '🚧' },
  { id: 6, title: '東區走廊更換隔音屏 來往交通受阻', source: '東方日報', time: '3小時前', category: 'district', district: '東區', icon: '🛣️' },
  { id: 7, title: '元朗YOHO Mall二期開幕 吸區外客', source: '蘋果日報', time: '4小時前', category: 'district', district: '元朗', icon: '🏬' },
  { id: 8, title: '沙田馬場公眾席明日開放免費入場', source: '明報', time: '5小時前', category: 'district', district: '沙田', icon: '🏇' },
]

// Community Data - HK Forums & Groups
const COMMUNITY_FORUMS = [
  { id: 1, name: '香港討論區', desc: '全港最大討論區', icon: '💬', color: 'from-blue-400 to-indigo-500', members: '50萬+', link: 'https://www.discuss.com.hk' },
  { id: 2, name: 'Uwants', desc: '本地生活討論', icon: '💭', color: 'from-purple-400 to-pink-500', members: '30萬+', link: 'https://www.uwants.com' },
  { id: 3, name: 'Baby-Kingdom', desc: '親子育兒熱點', icon: '👶', color: 'from-pink-400 to-rose-500', members: '20萬+', link: 'https://www.baby-kingdom.com' },
  { id: 4, name: 'MySmoothHeap', desc: '升學移民資訊', icon: '✈️', color: 'from-teal-400 to-cyan-500', members: '15萬+', link: 'https://www.mysmoothheap.com' },
]

// District Facebook Groups (Real Groups)
const DISTRICT_FB_GROUPS = [
  { district: '中西區', name: '中西區街坊會', members: '2.3萬' },
  { district: '灣仔', name: '灣仔社區事務', members: '1.8萬' },
  { district: '東區', name: '東區人', members: '3.2萬' },
  { district: '南區', name: '南區街坊', members: '1.5萬' },
  { district: '油尖旺', name: '油尖旺街坊', members: '2.8萬' },
  { district: '九龍城', name: '九龍城街坊會', members: '2.1萬' },
  { district: '觀塘', name: '觀塘友', members: '4.5萬' },
  { district: '沙田', name: '沙田社區', members: '3.8萬' },
  { district: '屯門', name: '屯門街坊', members: '3.2萬' },
  { district: '元朗', name: '元朗人', members: '4.1萬' },
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

// News Card
const NewsCard = ({ news }) => (
  <a href="#" className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
    <div className="flex items-start gap-3">
      <div className="text-2xl">{news.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-snug">{news.title}</h4>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span>{news.source}</span>
          <span>•</span>
          <span>{news.time}</span>
          {news.district && (
            <>
              <span>•</span>
              <span className="text-orange-500">{news.district}</span>
            </>
          )}
        </div>
      </div>
    </div>
  </a>
)

// Community Forum Card
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
  const [newsTab, setNewsTab] = useState('latest')
  const [communityTab, setCommunityTab] = useState('forums')
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

  // Filter news by tab
  const filteredNews = newsTab === 'hot' 
    ? MOCK_NEWS.filter(n => n.category === 'hot')
    : newsTab === 'district'
    ? MOCK_NEWS.filter(n => n.category === 'district')
    : MOCK_NEWS.filter(n => n.category === 'latest' || n.category === 'hot')

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
        
        {/* Main Tabs */}
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
        {/* 🍽️ Food Tab */}
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

        {/* 🎁 Deals Tab */}
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

        {/* 📅 Events Tab */}
        {activeTab === 'events' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎭</div>
            <p className="text-gray-500">精彩活動即將推出</p>
            <p className="text-xs text-gray-400 mt-2">敬請期待本地活動資訊</p>
          </div>
        )}

        {/* 📰 News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            {/* News Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'latest', label: '🔥 最新' },
                { key: 'hot', label: '📈 熱話' },
                { key: 'district', label: '📍 區議會' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setNewsTab(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    newsTab === tab.key 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* News List */}
            <div className="space-y-3">
              {filteredNews.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>
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
                {COMMUNITY_FORUMS.map(forum => (
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
                  {DISTRICT_FB_GROUPS.map(group => (
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
