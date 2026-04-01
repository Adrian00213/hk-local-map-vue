import { useState, useEffect } from 'react'
import { User, Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, Clock, MapPin, CreditCard, Smartphone, CheckCircle, ThumbsUp, LogOut, Edit3, Camera, Sparkles, TrendingUp, X, Moon, Volume2, Vibrate, ChevronDown, Award, Crown, Zap, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

// Premium gradients for a grand look
const PREMIUM_GRADIENTS = {
  gold: 'from-amber-600 via-yellow-500 to-amber-400',
  purple: 'from-violet-600 via-purple-500 to-fuchsia-500',
  blue: 'from-blue-600 via-cyan-500 to-sky-400',
  green: 'from-emerald-600 via-teal-500 to-green-400',
  pink: 'from-pink-600 via-rose-500 to-red-400',
  indigo: 'from-indigo-600 via-blue-500 to-cyan-400',
  sunset: 'from-orange-500 via-pink-500 to-purple-600',
  ocean: 'from-blue-600 via-indigo-500 to-violet-500',
}

// Sample saved deals for display
const SAVED_DEALS = [
  {
    id: '1',
    title: 'AlipayHK 消費券',
    desc: '用 AlipayHK 付款最高回贈 $500',
    brand: '支付寶HK',
    icon: '💜',
    gradient: 'purple',
    validUntil: '2026-03-31',
  },
  {
    id: '4',
    title: 'HSBC 信用卡 餐飲85折',
    desc: '指定餐廳消費85折優惠',
    brand: 'HSBC',
    icon: '🔴',
    gradient: 'pink',
    validUntil: '2026-03-31',
  },
]

// Sample user reviews
const USER_REVIEWS = [
  {
    id: '1',
    placeName: '九記牛腩',
    rating: 5,
    text: '真係必試！牛腩軟腍入味，麵底掛湯👍',
    time: '2日前',
    likes: 23,
  },
  {
    id: '2',
    placeName: '山頂纜車',
    rating: 4,
    text: '維港景色一流！建議傍晚去睇日落',
    time: '1週前',
    likes: 45,
  },
]

const MENU_ITEMS = [
  { icon: Heart, label: '我的收藏', subtitle: '已收藏地點', gradient: 'pink', action: 'favorites' },
  { icon: Gift, label: '我的優惠', subtitle: '收藏的優惠', gradient: 'gold', action: 'deals' },
  { icon: MessageCircle, label: '我的點評', subtitle: '發表的點評', gradient: 'green', action: 'reviews' },
  { icon: Star, label: '我的評分', subtitle: '評分歷史', gradient: 'indigo', action: 'ratings' },
  { icon: Bell, label: '通知設定', subtitle: '推送通知', gradient: 'blue', action: 'notifications' },
  { icon: Shield, label: '私隱設定', subtitle: '資料安全', gradient: 'ocean', action: 'privacy' },
  { icon: Globe, label: '語言設定', subtitle: '繁體/簡體/English', gradient: 'green', action: 'language' },
  { icon: Settings, label: '帳戶設定', subtitle: '個人資料', gradient: 'purple', action: 'account' },
]

export default function ProfileView() {
  const { user, isAuthenticated } = useAuth()
  const { locale, changeLanguage, getLanguageName, t } = useLocale()
  const currentLangName = getLanguageName(locale)
  
  const [savedDeals, setSavedDeals] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [favorites, setFavorites] = useState([])
  const [activeSection, setActiveSection] = useState(null)
  
  // Settings toggles
  const [notifications, setNotifications] = useState({
    push: true,
    sound: true,
    vibration: true,
    promotions: false,
  })
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('hk_saved_deals')
    if (saved) {
      const savedIds = JSON.parse(saved)
      setSavedDeals(SAVED_DEALS.filter(d => savedIds.includes(d.id)))
    }
    setUserReviews(USER_REVIEWS)
    
    const favs = localStorage.getItem('hk_favorites')
    if (favs) setFavorites(JSON.parse(favs))
  }, [])

  const getDaysLeft = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days}日` : '已過期'
  }

  // Ultra Premium Modal with stunning visuals
  const SettingsModal = ({ title, icon: Icon, gradient, children }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end justify-center animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-t-[40px] rounded-b-[20px] max-h-[92vh] overflow-hidden shadow-2xl shadow-black/20 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Breathtaking Gradient Header with shimmer effect */}
        <div className={`bg-gradient-to-br ${PREMIUM_GRADIENTS[gradient] || gradient} px-8 py-8 relative overflow-hidden`}>
          {/* Animated shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative flex items-center gap-5">
            <button 
              onClick={() => setActiveSection(null)}
              className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30 hover:bg-white/30 transition-all"
            >
              <X className="w-7 h-7 text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
                <p className="text-white/80 text-sm mt-1 font-medium">• 即時生效</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Luxurious Content Area */}
        <div className="bg-gradient-to-b from-gray-50/50 to-white min-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  )

  // Premium Toggle with glass morphism
  const PremiumToggle = ({ enabled, onToggle, label, subtitle, icon: IconComponent }) => (
    <div 
      className={`flex items-center gap-5 p-5 rounded-3xl transition-all duration-500 cursor-pointer group ${
        enabled 
          ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 shadow-lg shadow-green-200/50 border border-green-200/50' 
          : 'bg-white shadow-sm border border-gray-100 hover:shadow-md'
      }`}
      onClick={onToggle}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        enabled 
          ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl shadow-green-300' 
          : 'bg-gray-100 group-hover:bg-gray-200'
      }`}>
        {IconComponent && <IconComponent className={`w-7 h-7 ${enabled ? 'text-white' : 'text-gray-400'}`} />}
      </div>
      <div className="flex-1">
        <p className={`font-bold text-lg ${enabled ? 'text-green-800' : 'text-gray-800'}`}>{label}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <button
        className={`relative w-18 h-10 rounded-full transition-all duration-500 ${
          enabled 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-xl shadow-green-300' 
            : 'bg-gray-200'
        }`}
      >
        <span 
          className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-lg transition-all duration-500 flex items-center justify-center ${
            enabled ? 'translate-x-9' : 'translate-x-1'
          }`}
        >
          <span className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
        </span>
      </button>
    </div>
  )

  // Premium Language Option with flag
  const LanguageOption = ({ lang, flag, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-3xl border-2 transition-all duration-500 flex items-center gap-5 ${
        selected 
          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400 shadow-xl shadow-amber-200/50' 
          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg'
      }`}
    >
      <span className="text-4xl">{flag}</span>
      <span className={`text-xl font-bold ${selected ? 'text-amber-700' : 'text-gray-700'}`}>{lang}</span>
      {selected && (
        <div className="ml-auto w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-300">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
      )}
    </button>
  )

  // Notifications Settings - Ultra Premium
  if (activeSection === 'notifications') {
    return (
      <SettingsModal title="通知設定" icon={Bell} gradient="blue">
        <div className="p-6 space-y-5">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 rounded-3xl p-6 border border-blue-200/50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-800 text-lg">通知偏好</p>
                <p className="text-blue-600 mt-2 text-sm leading-relaxed">選擇你希望收到的即時通知和更新</p>
              </div>
            </div>
          </div>
          
          {/* Toggle Options */}
          <div className="space-y-4">
            <PremiumToggle 
              label="推送通知" 
              subtitle="接收新優惠、點評回覆等"
              enabled={notifications.push}
              icon={Bell}
              onToggle={() => setNotifications(n => ({ ...n, push: !n.push }))}
            />
            <PremiumToggle 
              label="通知聲音" 
              subtitle="清脆的提示音效"
              enabled={notifications.sound}
              icon={Volume2}
              onToggle={() => setNotifications(n => ({ ...n, sound: !n.sound }))}
            />
            <PremiumToggle 
              label="震動提示" 
              subtitle="配合聲音使用"
              enabled={notifications.vibration}
              icon={Vibrate}
              onToggle={() => setNotifications(n => ({ ...n, vibration: !n.vibration }))}
            />
            <PremiumToggle 
              label="推廣資訊" 
              subtitle="接收優惠及活動資訊"
              enabled={notifications.promotions}
              icon={Sparkles}
              onToggle={() => setNotifications(n => ({ ...n, promotions: !n.promotions }))}
            />
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Language Settings - Ultra Premium
  if (activeSection === 'language') {
    return (
      <SettingsModal title="語言設定" icon={Globe} gradient="green">
        <div className="p-6 space-y-5">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-green-100/80 to-teal-100/80 rounded-3xl p-6 border border-green-200/50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800 text-lg">介面語言</p>
                <p className="text-green-600 mt-2 text-sm leading-relaxed">選擇你最熟悉的語言</p>
              </div>
            </div>
          </div>
          
          {/* Language Options */}
          <div className="space-y-4">
            <LanguageOption 
              lang="繁體中文" 
              flag="🇭🇰"
              selected={currentLangName === '繁體中文'} 
              onClick={() => changeLanguage('繁體中文')} 
            />
            <LanguageOption 
              lang="簡體中文" 
              flag="🇨🇳"
              selected={currentLangName === '簡體中文'} 
              onClick={() => changeLanguage('簡體中文')} 
            />
            <LanguageOption 
              lang="English" 
              flag="🇬🇧"
              selected={currentLangName === 'English'} 
              onClick={() => changeLanguage('English')} 
            />
            <LanguageOption 
              lang="日本語" 
              flag="🇯🇵"
              selected={currentLangName === '日本語'} 
              onClick={() => changeLanguage('日本語')} 
            />
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Privacy Settings - Ultra Premium
  if (activeSection === 'privacy') {
    return (
      <SettingsModal title="私隱設定" icon={Shield} gradient="ocean">
        <div className="p-6 space-y-5">
          <div className="bg-gradient-to-r from-indigo-100/80 to-violet-100/80 rounded-3xl p-6 border border-indigo-200/50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-indigo-800 text-lg">資料安全</p>
                <p className="text-indigo-600 mt-2 text-sm leading-relaxed">保障你嘅個人資料安全</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {[
              { icon: User, label: '個人資料', sub: '管理你嘅帳戶資料', color: 'blue' },
              { icon: MapPin, label: '位置共享', sub: '設定位置分享範圍', color: 'green' },
              { icon: CreditCard, label: '已保存的付款方式', sub: '管理信用卡及電子銀包', color: 'purple' },
              { icon: Clock, label: '瀏覽記錄', sub: '查看及刪除瀏覽記錄', color: 'orange' },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center gap-5 p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                  item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  item.color === 'green' ? 'from-green-500 to-green-600' :
                  item.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-orange-500 to-orange-600'
                } flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Account Settings - Ultra Premium
  if (activeSection === 'account') {
    return (
      <SettingsModal title="帳戶設定" icon={Settings} gradient="purple">
        <div className="p-6 space-y-5">
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 rounded-3xl p-6 border border-purple-200/50">
            <div className="flex items-center gap-5 mb-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {user?.name?.charAt(0) || '用'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-lg">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-800">{user?.name || '香港用家'}</h3>
                <p className="text-purple-600 text-sm mt-1">{user?.email || '使用者電郵'}</p>
              </div>
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl transition-all">
              編輯個人資料
            </button>
          </div>
          
          {/* Account Options */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {[
              { icon: Smartphone, label: '電話號碼', value: '未設定', color: 'blue' },
              { icon: CreditCard, label: '已連結的帳戶', color: 'purple' },
              { icon: Shield, label: '更改密碼', color: 'green' },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center gap-5 p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                  item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  item.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-green-500 to-green-600'
                } flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800">{item.label}</p>
                  {item.value && <p className="text-sm text-gray-400">{item.value}</p>}
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300" />
              </button>
            ))}
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-indigo-600 to-purple-600' : 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}>
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">深色模式</p>
                  <p className="text-sm text-gray-500">夜間使用更舒適</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-18 h-10 rounded-full transition-all duration-500 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-xl shadow-indigo-200' 
                    : 'bg-gray-200'
                }`}
              >
                <span 
                  className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-lg transition-all duration-500 flex items-center justify-center ${
                    darkMode ? 'translate-x-9' : 'translate-x-1'
                  }`}
                >
                  <Moon className={`w-4 h-4 ${darkMode ? 'text-indigo-500' : 'text-gray-300'}`} />
                </span>
              </button>
            </div>
          </div>
          
          <button className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-3 text-lg">
            <LogOut className="w-6 h-6" />
            登出帳戶
          </button>
        </div>
      </SettingsModal>
    )
  }

  // Ratings History
  if (activeSection === 'ratings') {
    return (
      <SettingsModal title="我的評分" icon={Star} gradient="gold">
        <div className="p-6">
          <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-3xl p-8 border border-amber-200/50 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl mb-5">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">暫無評分記錄</h3>
            <p className="text-amber-600 text-sm">去地圖評分你 visit過的地方啦</p>
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Default Profile View - Ultra Premium Design
  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-amber-50/30 to-orange-50/30">
      {/* Hero Profile Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-amber-500 px-6 pt-12 pb-24 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
        <div className="absolute top-20 left-10 w-30 h-30 bg-yellow-300/20 rounded-full blur-2xl" />
        
        <div className="relative flex items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/40 flex items-center justify-center overflow-hidden shadow-2xl">
              <img 
                src="/favicon.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-xl flex items-center justify-center border-2 border-amber-200 hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-amber-600" />
            </button>
            {/* VIP Badge */}
            <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white tracking-wide">{user?.name || '香港用家'}</h2>
            <p className="text-white/70 text-sm mt-1">{user?.email || '探索香港生活'}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-xl text-xs text-white font-medium flex items-center gap-1">
                <Award className="w-4 h-4" />
                VIP 會員
              </span>
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-xl text-xs text-white font-medium flex items-center gap-1">
                <Zap className="w-4 h-4" />
                0 積分
              </span>
            </div>
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all">
            <Edit3 className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Bar - Floating Card */}
      <div className="bg-white mx-5 -mt-14 rounded-3xl shadow-2xl shadow-amber-200/40 p-5 relative z-10 border border-amber-100/50">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {[
            { label: '收藏', value: favorites.length, icon: Heart, color: 'pink' },
            { label: '優惠', value: savedDeals.length, icon: Gift, color: 'amber' },
            { label: '點評', value: userReviews.length, icon: MessageCircle, color: 'green' },
            { label: '積分', value: 0, icon: Star, color: 'purple' },
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => {
                if (item.label === '收藏') setActiveSection('favorites')
                else if (item.label === '優惠') setActiveSection('deals')
                else if (item.label === '點評') setActiveSection('reviews')
              }}
              className="text-center group"
            >
              <div className={`w-10 h-10 mx-auto rounded-2xl bg-gradient-to-br ${
                item.color === 'pink' ? 'from-pink-400 to-rose-500' :
                item.color === 'amber' ? 'from-amber-400 to-orange-500' :
                item.color === 'green' ? 'from-green-400 to-emerald-500' :
                'from-purple-400 to-violet-500'
              } flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-2`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="px-5 mt-6 space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">快速存取</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Gift, label: '我的優惠', gradient: 'gold', action: 'deals', count: savedDeals.length },
            { icon: MessageCircle, label: '我的點評', gradient: 'green', action: 'reviews', count: userReviews.length },
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveSection(item.action)}
              className={`bg-gradient-to-br ${PREMIUM_GRADIENTS[item.gradient]} p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all group`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-bold text-white text-lg">{item.label}</p>
              <p className="text-white/70 text-sm">{item.count} 個收藏</p>
            </button>
          ))}
        </div>
      </div>

      {/* Premium Menu List */}
      <div className="flex-1 overflow-y-auto px-5 mt-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1 mb-3">設定</h3>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.action)}
                className={`w-full flex items-center gap-5 px-6 py-5 hover:bg-gray-50/80 transition-colors ${
                  index !== MENU_ITEMS.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${PREMIUM_GRADIENTS[item.gradient]} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300" />
              </button>
            )
          })}
        </div>
        
        {/* App Branding */}
        <div className="text-center py-10 space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-200 mb-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-bold text-gray-700">香港本地生活地圖</p>
          <p className="text-sm text-gray-400">v1.0 Premium Edition</p>
          <p className="text-xs text-amber-500 mt-2 font-medium">Made with 🐉 in Hong Kong 🇭🇰</p>
        </div>
      </div>
    </div>
  )
}
