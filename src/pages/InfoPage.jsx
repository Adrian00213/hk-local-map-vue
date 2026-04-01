import { useState, useEffect, useRef } from 'react'
import { Utensils, Star, ThumbsUp, MapPin, Navigation, Clock, Search, Filter, X, Calendar, AlertCircle, Users, MessageCircle, Sparkles, ChevronRight, Heart, Share2, RefreshCw, Wifi, Newspaper, UsersRound, TrendingUp, Clock3, ExternalLink, Send, Image, MapPinned, Heart as HeartIcon, ThumbsUp as ThumbsUpIcon, Gift } from 'lucide-react'
import { getNearbyRestaurants, getTopRatedRestaurants, getRestaurantsByCuisine, getCuisineTypes, formatPrice, getPopularityScore, initRestaurants } from '../services/restaurantApi'
import { getAllEvents, formatEventDate } from '../services/eventsApi'
import LiveChat from '../components/LiveChat'

// Hong Kong 18 Districts
const HK_DISTRICTS = [
  { name: '中西區', nameEn: 'Central & Western', icon: '🏛️' },
  { name: '東區', nameEn: 'Eastern', icon: '🌊' },
  { name: '南區', nameEn: 'Southern', icon: '🏖️' },
  { name: '灣仔', nameEn: 'Wan Chai', icon: '🎯' },
  { name: '九龍城', nameEn: 'Kowloon City', icon: '🏯' },
  { name: '觀塘', nameEn: 'Kwun Tong', icon: '🏭' },
  { name: '深水埗', nameEn: 'Sham Shui Po', icon: '🛒' },
  { name: '黃大仙', nameEn: 'Wong Tai Sin', icon: '🧧' },
  { name: '油尖旺', nameEn: 'Yau Tsim Mong', icon: '✨' },
  { name: '離島', nameEn: 'Islands', icon: '🏝️' },
  { name: '葵青', nameEn: 'Kwai Tsing', icon: '🌺' },
  { name: '北區', nameEn: 'North', icon: '⛰️' },
  { name: '西貢', nameEn: 'Sai Kung', icon: '🗻' },
  { name: '沙田', nameEn: 'Sha Tin', icon: '🏞️' },
  { name: '大埔', nameEn: 'Tai Po', icon: '🌳' },
  { name: '荃灣', nameEn: 'Tsuen Wan', icon: '🌸' },
  { name: '屯門', nameEn: 'Tuen Mun', icon: '🏮' },
  { name: '元朗', nameEn: 'Yuen Long', icon: '🌾' },
]

// Mock Deals Data
const MOCK_DEALS = [
  { id: 1, brand: '麥當勞', title: '巨無霸套餐半價優惠', desc: '任何時間適用', discount: '50%', original: 'HK$45', badge: '熱賣', color: 'from-yellow-400 to-orange-500' },
  { id: 2, brand: '星巴克', title: '買一送一', desc: '指定飲品', discount: '50%', original: 'HK$38', badge: '限時', color: 'from-green-400 to-emerald-500' },
  { id: 3, brand: '肯德基', title: '炸雞桶減價', desc: '只限外賣', discount: '30%', original: 'HK$98', badge: '抵食', color: 'from-red-400 to-rose-500' },
  { id: 4, brand: '譚仔三哥', title: '米線買一送一', desc: '午市適用', discount: '50%', original: 'HK$55', badge: '必搶', color: 'from-orange-400 to-amber-500' },
  { id: 5, brand: '759零食', title: '全線85折', desc: '零食、飲品', discount: '15%', original: '', badge: '零食', color: 'from-pink-400 to-rose-500' },
  { id: 6, brand: '屈臣氏', title: '護膚品7折', desc: '指定品牌', discount: '30%', original: 'HK$280', badge: '美容', color: 'from-purple-400 to-violet-500' },
  { id: 7, brand: 'Nike', title: 'Air Max優惠', desc: '限量發售', discount: '40%', original: 'HK$1299', badge: '運動', color: 'from-blue-400 to-indigo-500' },
  { id: 8, brand: 'HM', title: '童裝減價', desc: '春夏新款', discount: '60%', original: 'HK$199', badge: '童裝', color: 'from-teal-400 to-cyan-500' },
  { id: 9, brand: 'Donki', title: '日式零食特賣', desc: '人氣零食', discount: '20%', original: '', badge: '日本', color: 'from-rose-400 to-pink-500' },
  { id: 10, brand: '影院', title: '星期二電影票', desc: '全線適用', discount: '半價', original: 'HK$90', badge: '娛樂', color: 'from-indigo-400 to-blue-500' },
  { id: 11, brand: 'Pizza Hut', title: 'pizza套餐優惠', desc: '家庭套餐', discount: '35%', original: 'HK$288', badge: '美食', color: 'from-amber-400 to-yellow-500' },
  { id: 12, brand: '大家樂', title: '早餐套餐', desc: '早上11時前', discount: '25%', original: 'HK$35', badge: '早餐', color: 'from-lime-400 to-green-500' },
]

// Mock News Data
const MOCK_NEWS = [
  { id: 1, title: '🎉 香港巴塞爾藝術展2027門票開售', district: '灣仔', source: 'HKET', time: '10分鐘前', image: '🖼️', likes: 234, comments: 56 },
  { id: 2, title: '🍜 必試！中環新開人氣打卡咖啡店', district: '中西區', source: 'OpenRice', time: '25分鐘前', image: '☕', likes: 567, comments: 89 },
  { id: 3, title: '🚇 屯馬線新站即將啟用', district: '屯門', source: 'MTR', time: '1小時前', image: '🚇', likes: 1200, comments: 234 },
  { id: 4, title: '🏠 施政報告：北部都會區最新進展', district: '北區', source: 'RTHK', time: '2小時前', image: '📋', likes: 890, comments: 167 },
  { id: 5, title: '🎭 M+博物館新展覽震撼登場', district: '西貢', source: 'SCMP', time: '3小時前', image: '🎨', likes: 456, comments: 78 },
  { id: 6, title: '🦐 將軍澳海鮮街春季優惠', district: '西貢', source: 'HKi', time: '4小時前', image: '🦀', likes: 345, comments: 45 },
  { id: 7, title: '🌸 維園花展2027人流創新高', district: '東區', source: 'HKET', time: '5小時前', image: '🌺', likes: 2100, comments: 456 },
  { id: 8, title: '🛍️ 沙田新城市廣場新餐廳進駐', district: '沙田', source: 'OpenRice', time: '6小時前', image: '🍽️', likes: 178, comments: 23 },
]

// Mock Community Posts
const MOCK_COMMUNITY_POSTS = [
  { id: 1, user: '美食達人', avatar: '🍔', district: '油尖旺', content: '今日喺旺角發現一間超正嘅茶餐廳！奶茶好好飲🥤', time: '5分鐘前', likes: 45, comments: 12, images: ['☕'] },
  { id: 2, user: '街頭小食愛好者', avatar: '🍢', district: '深水埗', content: '譚仔三哥試新出嘅酸辣米線，辣度啱啱好！🌶️', time: '15分鐘前', likes: 89, comments: 34, images: ['🍜'] },
  { id: 3, user: '咖啡探索者', avatar: '☕', district: '中西區', content: '中環PMQ附近有間型格咖啡店，環境好適合傾計', time: '30分鐘前', likes: 156, comments: 45, images: ['🏠'] },
  { id: 4, user: '行山新手', avatar: '🥾', district: '西貢', content: '周末去咗西貢東壩，天氣超好！風景一流🏔️', time: '1小時前', likes: 234, comments: 67, images: ['🌊'] },
  { id: 5, user: '親子媽咪', avatar: '👶', district: '沙田', content: '沙田親子好去處整理！科學園、夢湖畔、史諾比開心樂園👍', time: '2小時前', likes: 567, comments: 123, images: ['👨‍👩‍👧'] },
  { id: 6, user: '夜貓一族', avatar: '🌙', district: '灣仔', content: '灣仔邊間酒吧氣氛最好？求推薦🍸', time: '3小時前', likes: 78, comments: 89, images: ['🍹'] },
]

// Refresh Timer Bar Component
const RefreshTimerBar = ({ onRefresh }) => {
  const [secondsLeft, setSecondsLeft] = useState(300)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const intervalRef = useRef(null)

  useEffect(() => {
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
          className={`px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95 ${isRefreshing ? 'opacity-70' : ''}`}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? '更新中...' : '立即更新'}
        </button>
      </div>
      <div className="relative h-1.5 bg-blue-100 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
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

const getCuisineEmoji = (cuisine) => {
  const map = {
    '港式': '🇭🇰', '日式': '🍣', '中式': '🥢', '西式': '🍽️', '意式': '🍕',
    '法式': '🥐', '泰式': '🌶️', '韓式': '🇰🇷', '越南': '🍜', '印度': '🇮🇳',
    '海鮮': '🦐', '快餐': '🍔', '甜品': '🍮', '茶餐廳': '🧋', '麵食': '🍝',
    '燒味': '🍖', '點心': '🥟', '粥品': '🥣', '小食': '🍢', '冰室': '🧊',
  }
  return map[cuisine] || '🍴'
}

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < fullStars ? 'opacity-100' : i === fullStars && hasHalf ? 'opacity-50' : 'opacity-20'}`}>⭐</span>
      ))}
      <span className="ml-1 text-sm font-bold text-amber-600">{rating}</span>
    </div>
  )
}

const RestaurantCard = ({ restaurant, index, onLike }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer border border-gray-100" onClick={() => setShowDetail(!showDetail)}>
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl shrink-0">
          {getCuisineEmoji(restaurant.cuisine)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 truncate">{restaurant.name}</h3>
            <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); onLike?.() }} className={`p-1 rounded-full transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400'}`}>
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{restaurant.cuisine}</span>
            <span className="text-xs px-2 py-0.5 bg-amber-50 rounded-full text-amber-600">{restaurant.price}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <RatingStars rating={restaurant.rating} />
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.district}</span>
          </div>
        </div>
      </div>
      {showDetail && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in">
          <p className="text-xs text-gray-500 mb-2">📍 {restaurant.address}</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1"><Heart className="w-4 h-4" /> 收藏</button>
            <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1"><Share2 className="w-4 h-4" /> 分享</button>
          </div>
        </div>
      )}
    </div>
  )
}

const EventCard = ({ event, index }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl shrink-0">
        {checkEventStatus(event.startDate) === 'upcoming' ? '🔥' : '✨'}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">{formatEventDate(event.startDate)}</span>
        </div>
      </div>
    </div>
  </div>
)

// Deal Card Component
const DealCard = ({ deal, onLike, onShare }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer active:scale-98">
    <div className={`h-2 bg-gradient-to-r ${deal.color}`} />
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.color} flex flex-col items-center justify-center shrink-0`}>
          <span className="text-white font-bold text-lg">{deal.discount}</span>
          <span className="text-white/80 text-xs">OFF</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500">{deal.brand}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${deal.color}`}>{deal.badge}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">{deal.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{deal.desc}</p>
          {deal.original && (
            <p className="text-xs text-gray-400 mt-1"><span className="line-through">{deal.original}</span> → <span className="text-green-600 font-medium">優惠價</span></p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onLike?.(deal) }}
          className="flex-1 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          <Heart className="w-4 h-4" /> 收藏
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onShare?.(deal) }}
          className="flex-1 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4" /> 分享
        </button>
      </div>
    </div>
  </div>
)

// News Card Component
const NewsCard = ({ news }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer active:scale-98">
    <div className="flex gap-3">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl shrink-0">
        {news.image}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{news.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{news.source}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock3 className="w-3 h-3" />{news.time}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400 flex items-center gap-1"><MapPinned className="w-3 h-3" />{news.district}</span>
          <span className="text-xs text-gray-400 flex items-center gap-1"><HeartIcon className="w-3 h-3" />{news.likes}</span>
          <span className="text-xs text-gray-400 flex items-center gap-1"><MessageCircle className="w-3 h-3" />{news.comments}</span>
        </div>
      </div>
    </div>
  </div>
)

// Community Post Component
const CommunityPost = ({ post }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-xl">
        {post.avatar}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900">{post.user}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <MapPinned className="w-3 h-3" />{post.district} · {post.time}
        </p>
      </div>
    </div>
    <p className="text-sm text-gray-700 mb-3">{post.content}</p>
    {post.images && (
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {post.images.map((img, i) => (
          <div key={i} className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shrink-0">
            {img}
          </div>
        ))}
      </div>
    )}
    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
      <button className="flex items-center gap-1 text-xs text-gray-500 active:scale-90 transition-transform">
        <Heart className="w-4 h-4" /> {post.likes}
      </button>
      <button className="flex items-center gap-1 text-xs text-gray-500 active:scale-90 transition-transform">
        <MessageCircle className="w-4 h-4" /> {post.comments}
      </button>
      <button className="flex items-center gap-1 text-xs text-gray-500 active:scale-90 transition-transform ml-auto">
        <Share2 className="w-4 h-4" /> 分享
      </button>
    </div>
  </div>
)

export default function InfoPage({ showToast }) {
  const [activeTab, setActiveTab] = useState('food')
  const [foodCategory, setFoodCategory] = useState('全部')
  const [dealCategory, setDealCategory] = useState('全部')
  const [newsTab, setNewsTab] = useState('latest')
  const [communityDistrict, setCommunityDistrict] = useState('全部')
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyRestaurants, setNearbyRestaurants] = useState([])
  const [topRestaurants, setTopRestaurants] = useState([])
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [cuisineTypes, setCuisineTypes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // Food categories - maps Chinese labels to English types
  const FOOD_CATEGORIES = [
    { key: '全部', label: '🍽️ 全部', emoji: '🍽️', types: ['restaurant', 'cafe', 'bakery', 'bar', 'food', 'meal_takeaway', 'meal_delivery'] },
    { key: '餐廳', label: '🍜 餐廳', emoji: '🍜', types: ['restaurant'] },
    { key: '咖啡', label: '☕ 咖啡店', emoji: '☕', types: ['cafe'] },
    { key: '酒吧', label: '🍸 酒吧', emoji: '🍸', types: ['bar', 'night_club'] },
    { key: '快餐', label: '🍔 快餐', emoji: '🍔', types: ['fast_food'] },
    { key: '甜品', label: '🍰 甜品', emoji: '🍰', types: [] }, // No direct type, show none
    { key: '麵包', label: '🥐 麵包店', emoji: '🥐', types: ['bakery'] },
    { key: '外賣', label: '🍱 外賣', emoji: '🍱', types: ['meal_takeaway', 'meal_delivery'] },
  ]

  useEffect(() => {
    const loadData = async () => {
      console.log('[InfoPage] loadData started')
      
      // First initialize and load the restaurant data from JSON
      await initRestaurants()
      console.log('[InfoPage] initRestaurants completed')
      
      // Get ALL restaurants (no distance filter) and top rated
      const { getAllRestaurants, getTopRatedRestaurants, getCuisineTypes } = await import('../services/restaurantApi')
      const [all, top, cuisines] = await Promise.all([
        getAllRestaurants(),
        getTopRatedRestaurants(100),
        getCuisineTypes()
      ])
      
      console.log('[InfoPage] getAllRestaurants returned:', all.length, 'restaurants')
      console.log('[InfoPage] getTopRatedRestaurants returned:', top.length, 'restaurants')
      
      setNearbyRestaurants(all)  // Show ALL restaurants
      setTopRestaurants(top)
      setCuisineTypes(cuisines.slice(0, 15))
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => {}
        )
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'events' && events.length === 0) {
      setEventsLoading(true)
      getAllEvents().then(data => { setEvents(data); setEventsLoading(false) })
    }
  }, [activeTab])

  const handleLike = (name) => {
    showToast?.({ message: `❤️ 已收藏 ${name}`, type: 'success' })
  }

  const handleDealLike = (deal) => {
    showToast?.({ message: `❤️ 已收藏優惠：${deal.title}`, type: 'success' })
  }

  const handleDealShare = (deal) => {
    const shareText = `🎁 ${deal.title} - ${deal.brand} 優惠！${deal.discount} OFF！`
    if (navigator.share) {
      navigator.share({ title: deal.title, text: shareText })
    } else {
      navigator.clipboard?.writeText(shareText)
      showToast?.({ message: `📋 已複製優惠內容：${deal.title}`, type: 'success' })
    }
  }

  const displayedRestaurants = cuisineFilter ? topRestaurants.filter(r => r.cuisine.includes(cuisineFilter)) : topRestaurants

  const filteredPosts = communityDistrict === '全部' ? MOCK_COMMUNITY_POSTS : MOCK_COMMUNITY_POSTS.filter(p => p.district.includes(communityDistrict))

  return (
    <div className="h-full bg-gradient-to-b from-orange-50/50 to-amber-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-amber-100 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">🍜 美食指南</h1>
            <p className="text-xs text-gray-500">{userLocation ? '📍 已開啟位置' : '🌍 顯示全港美食'}</p>
          </div>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搵餐廳... 🔍" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['food', 'deals', 'events', 'news', 'community'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              activeTab === tab ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
              {tab === 'food' && '🍽️ 餐飲'}
              {tab === 'deals' && '🎁 優惠'}
              {tab === 'events' && '📅 活動'}
              {tab === 'news' && '📰 新聞'}
              {tab === 'community' && '👥 社區'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <RefreshTimerBar onRefresh={() => { getTopRatedRestaurants(50).then(setTopRestaurants) }} />
        
        {activeTab === 'food' && (
          <div className="space-y-4">
            {/* Food Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {FOOD_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setFoodCategory(cat.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                    foodCategory === cat.key
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                      : 'bg-white text-gray-600 border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 18 Districts Quick Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setCuisineFilter('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${!cuisineFilter ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}
              >
                🌍 全港
              </button>
              {HK_DISTRICTS.slice(0, 6).map(d => (
                <button
                  key={d.name}
                  onClick={() => setCuisineFilter(d.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${cuisineFilter === d.name ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  {d.icon} {d.name}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 border border-orange-100">
              <p className="text-sm font-medium text-orange-800">📊 餐飲總數：{nearbyRestaurants.length} 間</p>
            </div>

            {/* Restaurant List */}
            <div className="space-y-3">
              {nearbyRestaurants
                .filter(r => {
                  if (foodCategory === '全部') return true
                  const cat = FOOD_CATEGORIES.find(c => c.key === foodCategory)
                  if (!cat || cat.types.length === 0) return true
                  // Check both type and allTypes for matches
                  const rType = (r.type || '').toLowerCase()
                  const rAllTypes = (r.allTypes || []).map(t => t.toLowerCase())
                  return cat.types.some(t => 
                    rType === t.toLowerCase() || rAllTypes.includes(t.toLowerCase())
                  )
                })
                .filter(r => !cuisineFilter || r.district === cuisineFilter || r.name.includes(cuisineFilter))
                .map((r, i) => <RestaurantCard key={r.name} restaurant={r} index={i} onLike={() => handleLike(r.name)} />)}
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-4">
            {/* Deals Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">🎁 香港優惠</h2>
                  <p className="text-xs text-gray-500">{MOCK_DEALS.length} 個精選優惠</p>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['全部', '美食', '購物', '美容', '運動', '娛樂', '生活'].map(cat => (
                <button key={cat} onClick={() => setDealCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${dealCategory === cat ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border'}`}>
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Deals Grid */}
            <div className="grid grid-cols-1 gap-3">
              {MOCK_DEALS.map(deal => <DealCard key={deal.id} deal={deal} onLike={handleDealLike} onShare={handleDealShare} />)}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            {eventsLoading ? (
              <div className="flex flex-col items-center justify-center py-12"><div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div><p className="mt-4 text-sm text-gray-500">緊係... 💫</p></div>
            ) : events.length > 0 ? (
              <><div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100"><p className="text-sm font-medium text-purple-800">🎉 香港精彩活動</p><p className="text-xs text-purple-600 mt-1">即將舉行 {events.length} 個活動</p></div><div className="space-y-3">{events.slice(0, 20).map((e, i) => <EventCard key={e.id || i} event={e} index={i} />)}</div></>
            ) : (
              <div className="text-center py-12"><div className="text-5xl mb-4">🎭</div><p className="text-gray-500">暫時未有活動資訊</p></div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-4">
            {/* News Sub-tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[{ key: 'latest', label: '🔥 最新' }, { key: 'trending', label: '📈 熱話' }].map(tab => (
                <button key={tab.key} onClick={() => setNewsTab(tab.key)} className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${newsTab === tab.key ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-white text-gray-600 border'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* News Feed */}
            <div className="space-y-3">
              {MOCK_NEWS.map(news => <NewsCard key={news.id} news={news} />)}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-4">
            {/* Community Header with 18 Districts */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                  <UsersRound className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">👥 香港社群</h2>
                  <p className="text-xs text-gray-500">與18區街坊互動</p>
                </div>
              </div>
              {/* 18 Districts Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setCommunityDistrict('全部')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${communityDistrict === '全部' ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'}`}>
                  🌍 全部
                </button>
                {HK_DISTRICTS.map(d => (
                  <button key={d.name} onClick={() => setCommunityDistrict(d.name)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${communityDistrict === d.name ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'}`}>
                    {d.icon} {d.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Community Posts */}
            <div className="space-y-3">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => <CommunityPost key={post.id} post={post} />)
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <div className="text-4xl mb-3">👻</div>
                  <p className="text-gray-500 text-sm">呢個區仲未有post</p>
                  <p className="text-xs text-gray-400 mt-1">成個區分享你嘅發現！</p>
                </div>
              )}
            </div>
            
            {/* Load More */}
            <button className="w-full py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 active:scale-98">
              載入更多 💬
            </button>
            
            {/* Facebook Group CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-xl">
                  f
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">加入Facebook社群</h3>
                  <p className="text-xs text-gray-500">香港各區吃喝玩樂群組</p>
                </div>
                <button onClick={() => showToast?.({ message: '即將開啟 Facebook 社群連結...', type: 'info' })} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" /> 加入
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function checkEventStatus(startDate) {
  const now = new Date()
  const start = new Date(startDate)
  return start > now ? 'upcoming' : 'past'
}
