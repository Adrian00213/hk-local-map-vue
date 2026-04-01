import { useState, useEffect } from 'react'
import { User, Settings, Bell, Globe, Shield, Star, Gift, MessageCircle, Heart, ChevronRight, Clock, MapPin, CreditCard, Smartphone, CheckCircle, ThumbsUp, LogOut, Edit3, Camera, Sparkles, TrendingUp, X, Moon, Volume2, Vibrate, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Sample saved deals for display
const SAVED_DEALS = [
  {
    id: '1',
    title: 'AlipayHK 消費券',
    desc: '用 AlipayHK 付款最高回贈 $500',
    brand: '支付寶HK',
    icon: '💜',
    color: 'from-purple-500 to-pink-500',
    validUntil: '2026-03-31',
  },
  {
    id: '4',
    title: 'HSBC 信用卡 餐飲85折',
    desc: '指定餐廳消費85折優惠',
    brand: 'HSBC',
    icon: '🔴',
    color: 'from-red-500 to-rose-500',
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
  { icon: Heart, label: '我的收藏', subtitle: '已收藏地點', color: 'from-pink-500 to-rose-500', action: 'favorites' },
  { icon: Gift, label: '我的優惠', subtitle: '收藏的優惠', color: 'from-yellow-500 to-yellow-600', action: 'deals' },
  { icon: MessageCircle, label: '我的點評', subtitle: '發表的點評', color: 'from-emerald-500 to-teal-500', action: 'reviews' },
  { icon: Star, label: '我的評分', subtitle: '評分歷史', color: 'from-violet-500 to-purple-500', action: 'ratings' },
  { icon: Bell, label: '通知設定', subtitle: '推送通知', color: 'from-blue-500 to-cyan-500', action: 'notifications' },
  { icon: Shield, label: '私隱設定', subtitle: '資料安全', color: 'from-slate-500 to-gray-500', action: 'privacy' },
  { icon: Globe, label: '語言設定', subtitle: '繁體/簡體/English', color: 'from-teal-500 to-emerald-500', action: 'language' },
  { icon: Settings, label: '帳戶設定', subtitle: '個人資料', color: 'from-zinc-500 to-neutral-500', action: 'account' },
]

export default function ProfileView() {
  const { user, isAuthenticated } = useAuth()
  const [savedDeals, setSavedDeals] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [favorites, setFavorites] = useState([])
  const [activeSection, setActiveSection] = useState(null) // 'deals' | 'reviews' | 'favorites' | 'notifications' | 'privacy' | 'language' | 'account'
  
  // Settings toggles
  const [notifications, setNotifications] = useState({
    push: true,
    sound: true,
    vibration: true,
    promotions: false,
  })
  const [language, setLanguage] = useState('繁體中文')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Load saved deals
    const saved = localStorage.getItem('hk_saved_deals')
    if (saved) {
      const savedIds = JSON.parse(saved)
      setSavedDeals(SAVED_DEALS.filter(d => savedIds.includes(d.id)))
    }
    setUserReviews(USER_REVIEWS)
    
    // Load favorites
    const favs = localStorage.getItem('hk_favorites')
    if (favs) setFavorites(JSON.parse(favs))
  }, [])

  const getDaysLeft = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days}日` : '已過期'
  }

  // Beautiful Settings Modal with glass morphism effect
  const SettingsModal = ({ title, icon: Icon, color, gradient, children }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setActiveSection(null)}>
      <div 
        className="bg-white w-full max-w-lg rounded-t-[32px] max-h-[90vh] overflow-hidden animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${gradient} px-6 py-5 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-white/10 rounded-full" />
          
          <div className="relative flex items-center gap-4">
            <button 
              onClick={() => setActiveSection(null)}
              className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-white/70 text-sm">即時生效</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="bg-gray-50/50 min-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  )

  // Beautiful Toggle Switch with smooth animation
  const ToggleSwitch = ({ enabled, onToggle, label, subtitle, icon: IconComponent }) => (
    <div 
      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
      onClick={onToggle}
    >
      {IconComponent && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          enabled 
            ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200' 
            : 'bg-gray-100 group-hover:bg-gray-200'
        } transition-all`}>
          <IconComponent className={`w-6 h-6 ${enabled ? 'text-white' : 'text-gray-400'}`} />
        </div>
      )}
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <button
        className={`relative w-16 h-9 rounded-full transition-all duration-300 ${
          enabled 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-200' 
            : 'bg-gray-200'
        }`}
      >
        <span 
          className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
            enabled ? 'translate-x-8' : 'translate-x-1'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
        </span>
      </button>
    </div>
  )

  // Beautiful Language Option with flag emoji
  const LanguageOption = ({ lang, flag, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
        selected 
          ? 'border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg shadow-amber-100' 
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <span className="text-3xl">{flag}</span>
      <span className={`font-semibold text-lg ${selected ? 'text-amber-700' : 'text-gray-700'}`}>{lang}</span>
      {selected && (
        <div className="ml-auto w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      )}
    </button>
  )

  // Notifications Settings - Beautiful Design
  if (activeSection === 'notifications') {
    return (
      <SettingsModal title="通知設定" icon={Bell} gradient="from-blue-500 via-cyan-500 to-teal-500">
        <div className="p-5 space-y-4">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-5 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">通知權限</p>
                <p className="text-sm text-blue-600 mt-1">選擇你想收到的通知類型</p>
              </div>
            </div>
          </div>
          
          {/* Toggle Options with Icons */}
          <div className="space-y-3">
            <ToggleSwitch 
              label="推送通知" 
              subtitle="接收新優惠、點評回覆等通知"
              enabled={notifications.push}
              onToggle={() => setNotifications(n => ({ ...n, push: !n.push }))}
            />
            <ToggleSwitch 
              label="通知聲音" 
              subtitle="收到通知時播放提示音"
              enabled={notifications.sound}
              onToggle={() => setNotifications(n => ({ ...n, sound: !n.sound }))}
            />
            <ToggleSwitch 
              label="震動提示" 
              subtitle="配合聲音使用"
              enabled={notifications.vibration}
              onToggle={() => setNotifications(n => ({ ...n, vibration: !n.vibration }))}
            />
            <ToggleSwitch 
              label="推廣資訊" 
              subtitle="接收優惠及活動資訊"
              enabled={notifications.promotions}
              onToggle={() => setNotifications(n => ({ ...n, promotions: !n.promotions }))}
            />
          </div>
          
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mt-6">
            <p className="text-xs text-gray-500 text-center">開啟的通知數量：{
              [notifications.push, notifications.sound, notifications.vibration, notifications.promotions].filter(Boolean).length
            } / 4</p>
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Privacy Settings
  if (activeSection === 'privacy') {
    return (
      <SettingsModal title="私隱設定" icon={Shield} color="from-slate-500 to-gray-500">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-slate-700">保障你嘅個人資料安全</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-zinc-900">個人資料</p>
                  <p className="text-xs text-zinc-500">管理你嘅帳戶資料</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-zinc-900">位置共享</p>
                  <p className="text-xs text-zinc-500">設定位置分享範圍</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-zinc-900">已保存的付款方式</p>
                  <p className="text-xs text-zinc-500">管理信用卡及電子銀包</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-zinc-900">瀏覽記錄</p>
                  <p className="text-xs text-zinc-500">查看及刪除瀏覽記錄</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Language Settings
  if (activeSection === 'language') {
    return (
      <SettingsModal title="語言設定" icon={Globe} color="from-teal-500 to-emerald-500">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-teal-700">選擇你喜歡的語言</p>
          </div>
          
          <div className="space-y-3">
            <LanguageOption 
              lang="繁體中文" 
              selected={language === '繁體中文'} 
              onClick={() => setLanguage('繁體中文')} 
            />
            <LanguageOption 
              lang="简体中文" 
              selected={language === '简体中文'} 
              onClick={() => setLanguage('简体中文')} 
            />
            <LanguageOption 
              lang="English" 
              selected={language === 'English'} 
              onClick={() => setLanguage('English')} 
            />
            <LanguageOption 
              lang="日本語" 
              selected={language === '日本語'} 
              onClick={() => setLanguage('日本語')} 
            />
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Account Settings
  if (activeSection === 'account') {
    return (
      <SettingsModal title="帳戶設定" icon={Settings} color="from-zinc-500 to-neutral-500">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-zinc-50 to-neutral-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-zinc-700">管理你嘅帳戶及個人資料</p>
          </div>
          
          {/* Profile Edit */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || '用'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 text-lg">{user?.name || '香港用家'}</h3>
                <p className="text-sm text-zinc-500">{user?.email || '使用者電郵'}</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium">
              編輯個人資料
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-zinc-600" />
                <span className="font-medium text-zinc-900">電話號碼</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">未設定</span>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-zinc-600" />
                <span className="font-medium text-zinc-900">已連結的帳戶</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-zinc-600" />
                <span className="font-medium text-zinc-900">更改密碼</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-zinc-600" />
                <span className="font-medium text-zinc-900">深色模式</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-8 rounded-full transition-colors relative ${
                  darkMode ? 'bg-gradient-to-r from-zinc-600 to-zinc-800' : 'bg-zinc-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform absolute top-1 ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
          
          <button className="w-full py-3 text-red-500 font-medium flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            登出帳戶
          </button>
        </div>
      </SettingsModal>
    )
  }

  // Ratings History
  if (activeSection === 'ratings') {
    return (
      <SettingsModal title="我的評分" icon={Star} color="from-violet-500 to-purple-500">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-violet-700">你曾經評分的地點</p>
          </div>
          
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
              <Star className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">暫無評分記錄</h3>
            <p className="text-sm text-zinc-400">去地圖評分你 visit過的地方啦</p>
          </div>
        </div>
      </SettingsModal>
    )
  }

  // Show deals section
  if (activeSection === 'deals') {
    return (
      <div className="h-full w-full flex flex-col bg-zinc-50">
        <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-600 rotate-180" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">我的優惠</h1>
              <p className="text-sm text-zinc-400">已收藏 {savedDeals.length} 個優惠</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {savedDeals.length > 0 ? (
            <div className="space-y-4">
              {savedDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${deal.color}`} />
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.color} flex items-center justify-center text-3xl shadow-lg`}>
                        {deal.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-zinc-400 font-medium">{deal.brand}</span>
                        <h3 className="font-bold text-zinc-900">{deal.title}</h3>
                        <p className="text-sm text-zinc-500 mt-1">{deal.desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-lg text-xs font-medium">
                            有效期：{getDaysLeft(deal.validUntil)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <Gift className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">未收藏過優惠</h3>
              <p className="text-sm text-zinc-400">去「我的」收藏心水優惠啦</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show reviews section
  if (activeSection === 'reviews') {
    return (
      <div className="h-full w-full flex flex-col bg-zinc-50">
        <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-600 rotate-180" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">我的點評</h1>
              <p className="text-sm text-zinc-400">已發表 {userReviews.length} 篇點評</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600">{review.placeName}</span>
                        <span className="text-xs text-zinc-400">{review.time}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-amber-400' : 'text-zinc-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100">
                    <ThumbsUp className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-500">{review.likes} 人覺得有用</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">未發表過點評</h3>
              <p className="text-sm text-zinc-400">試下分享你嘅體驗啦！</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show favorites section
  if (activeSection === 'favorites') {
    return (
      <div className="h-full w-full flex flex-col bg-zinc-50">
        <div className="bg-white border-b border-zinc-100/80 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection(null)} className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-zinc-600 rotate-180" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">我的收藏</h1>
              <p className="text-sm text-zinc-400">已收藏 {favorites.length} 個地點</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {favorites.length > 0 ? (
            <div className="space-y-4">
              {favorites.map((fav, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-900">{fav.name || fav.placeName}</h3>
                      {fav.category && (
                        <span className="text-xs text-pink-500 font-medium">{fav.category}</span>
                      )}
                      {fav.description && (
                        <p className="text-sm text-zinc-500 mt-1">{fav.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <Heart className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">未收藏過地方</h3>
              <p className="text-sm text-zinc-400">去地圖碌碌，儲你最like嘅地方</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default Profile View
  return (
    <div className="h-full w-full flex flex-col bg-zinc-50">
      {/* Profile Header - Premium Design */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 px-5 pt-8 pb-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
              <img 
                src="/favicon.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-95 transition-transform">
              <Camera className="w-4 h-4 text-yellow-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name || '香港用家'}</h2>
            <p className="text-white/70 text-sm mt-0.5">{user?.email || '探索香港生活'}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs text-white font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Level 1
              </span>
              <span className="flex items-center gap-1 text-xs text-white/70">
                <Sparkles className="w-3 h-3" />
                0 積分
              </span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform">
            <Edit3 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white mx-4 -mt-8 rounded-2xl shadow-lg shadow-amber-200/30 p-4">
        <div className="grid grid-cols-4 gap-4">
          <button onClick={() => setActiveSection('favorites')} className="text-center hover:bg-zinc-50 rounded-xl p-2 -m-2 transition-colors">
            <div className="text-xl font-bold text-zinc-900">{favorites.length}</div>
            <div className="text-xs text-zinc-500">收藏</div>
          </button>
          <button onClick={() => setActiveSection('deals')} className="text-center hover:bg-zinc-50 rounded-xl p-2 -m-2 transition-colors">
            <div className="text-xl font-bold text-zinc-900">{savedDeals.length}</div>
            <div className="text-xs text-zinc-500">優惠</div>
          </button>
          <button onClick={() => setActiveSection('reviews')} className="text-center hover:bg-zinc-50 rounded-xl p-2 -m-2 transition-colors">
            <div className="text-xl font-bold text-zinc-900">{userReviews.length}</div>
            <div className="text-xs text-zinc-500">點評</div>
          </button>
          <div className="text-center">
            <div className="text-xl font-bold text-zinc-900">0</div>
            <div className="text-xs text-zinc-500">積分</div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">快速存取</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveSection('deals')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100/80 flex items-center gap-3 card-hover"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-zinc-900">我的優惠</div>
              <div className="text-xs text-zinc-500">{savedDeals.length} 個收藏</div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveSection('reviews')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100/80 flex items-center gap-3 card-hover"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-zinc-900">我的點評</div>
              <div className="text-xs text-zinc-500">{userReviews.length} 篇發表</div>
            </div>
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-5 mt-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">設定</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100/80 overflow-hidden">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isLast = index === MENU_ITEMS.length - 1
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.action)}
                className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 transition-colors ${
                  !isLast ? 'border-b border-zinc-100/80' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-zinc-900">{item.label}</div>
                  <div className="text-xs text-zinc-500">{item.subtitle}</div>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 bg-violet-100 text-violet-600 rounded-lg text-xs font-bold">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </button>
            )
          })}
        </div>
        
        {/* App Version */}
        <div className="text-center py-8">
          <p className="text-xs text-zinc-400">香港本地生活地圖 v1.0</p>
          <p className="text-xs text-zinc-300 mt-1">Made with 🐉 in Hong Kong</p>
        </div>
      </div>
    </div>
  )
}
